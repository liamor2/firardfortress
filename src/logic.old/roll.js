import { loadTemplate } from "./loader.js";
import {
  getItemData,
  getItemCardData,
  handleAdventureBalance,
  validateCardRollOrigin,
} from "./itemManager.js";
import { getActorData } from "./actorManager.js";
import { logToConsole } from "./helper.js";

function handleRoll(event) {
  event.preventDefault();
  const dataset = event.currentTarget.dataset;

  const data = fetchDataBasedOnSource(dataset);
  if (!data) return;

  processRoll(data, dataset.type);
}

function fetchDataBasedOnSource(dataset) {
  switch (dataset.from) {
    case "actor":
      return getActorData(dataset);
    case "item":
      return getItemData(dataset);
    case "itemCard":
      const data = getItemCardData(dataset);
      if (!validateCardRollOrigin(data)) {
        return null;
      }
      return data;
    default:
      logToConsole("error", "Roll", `Unknown source for roll: ${dataset.from}`);
      return null;
  }
}

function processRoll(data, rollType) {
  const rollFunctions = {
    attackRoll: handleAttackRoll,
    itemRoll: handleItemRoll,
    statRoll: handleStatRoll,
    adventureRoll: handleAdventureRoll,
    itemCard: handleItemCardRoll,
  };

  const rollFunction = rollFunctions[rollType];
  if (rollFunction) {
    rollFunction(data);
  } else {
    logToConsole("error", "Roll", `Unknown roll type: ${rollType}`);
  }
}

async function handleAttackRoll(data) {
  const template = await loadTemplate(
    "/systems/firardfortress/templates/parts/messages/attackRollMessages.hbs"
  );

  let rollsData = [];
  let finalRoll = 0;

  let totalFormula = "";
  for (const key in data.item.system.roll) {
    const roll = data.item.system.roll[key];
    totalFormula += `${roll.dice}${roll.type}+${roll.bonus} + `;
  }
  totalFormula = totalFormula.slice(0, -3);

  let aggregateRoll = new Roll(totalFormula);
  await aggregateRoll.evaluate();
  if (game.modules.get("dice-so-nice")?.active) {
    game.dice3d.showForRoll(aggregateRoll);
  }

  const dieTerms = aggregateRoll.terms.filter((term) => term instanceof foundry.dice.terms.Die);

  let rollIndex = 0;
  for (const key in data.item.system.roll) {
    const roll = data.item.system.roll[key];
    let numDice = roll.dice;
    let currentTypeResults = [];
    for (let i = 0; i < dieTerms.length; i++) {
      if (
        dieTerms[i].number === numDice &&
        dieTerms[i].faces === parseInt(roll.type.slice(1), 10)
      ) {
        currentTypeResults.push(
          ...dieTerms[i].results.map((r) => ({
            result: r.result,
            maxRoll: dieTerms[i].faces,
          }))
        );
        break;
      }
    }

    let rollSubTotal = currentTypeResults.reduce((acc, r) => acc + r.result, 0);
    rollsData.push({
      damageType: roll.damageType,
      total: rollSubTotal + roll.bonus,
      details: currentTypeResults,
      bonus: roll.bonus,
      maxRoll: parseInt(roll.type.slice(1), 10),
      formula: `${numDice}${roll.type}+${roll.bonus}`,
    });
    finalRoll += rollSubTotal + roll.bonus;
  }

  const contentHtml = template({
    itemName: data.item.name,
    rolls: rollsData,
    finalRoll: finalRoll,
  });

  let chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor: data.actor }),
    content: contentHtml,
    roll: finalRoll,
  };

  if (game.modules.get("dice-so-nice")?.active) {
    setTimeout(() => {
      ChatMessage.create(chatData);
    }, 2000);
  } else {
    ChatMessage.create(chatData);
  }
}

function handleItemRoll(data) {
  let formula = data.item.system.rollDetails.formula;

  if (data.actor && Object.keys(data.actor).length === 0) {
    new Dialog({
      title: `${game.i18n.localize("FI.System.Rolling.RollsItemNoActorTitle")}`,
      content: `<p>${game.i18n.localize("FI.System.Rolling.RollsItemNoActorContent")}</p><strong>1d20${formula}</strong>`,
      buttons: {
        ok: {
          icon: '<i class="fas fa-check"></i>',
          label: `${game.i18n.localize("FI.Dialog.Ok")}`,
          callback: () =>
            prepareRoll(
              formula,
              data.actor,
              `${data.item.name}: ${game.i18n.localize(`FI.Stat.${data.item.system.stat}`)}`
            ),
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: `${game.i18n.localize("FI.Dialog.Cancel")}`,
        },
      },
      default: "cancel",
    }).render(true);
  } else {
    prepareRoll(
      formula,
      data.actor,
      `${data.item.name}: ${game.i18n.localize(`FI.Stat.${data.item.system.stat}`)}`
    );
  }
}

function prepareRoll(formula, actor, statName) {
  if (game.settings.get("firardfortress", "enableAdvanceRolls")) {
    handleAdvancedRoll(formula, actor, statName);
  } else {
    handleSimpleRoll(formula, actor, statName);
  }
}

async function handleAdvancedRoll(formula, actor, statName) {
  const template = await loadTemplate(
    "/systems/firardfortress/templates/parts/messages/advancedRollDialog.hbs"
  );
  console.log("Advanced roll", formula, actor, statName);
  new Dialog({
    title: `${game.i18n.localize("FI.System.AdvancedRolling")}: ${actor.name} - ${statName}`,
    content: template,
    buttons: {
      confirm: {
        icon: '<i class="fas fa-check"></i>',
        label: "Confirm",
        callback: (html) => {
          renderAdvancedRollMessage(formula, actor, statName, html);
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel",
      },
    },
    default: "confirm",
  }).render(true);
}

function renderAdvancedRollMessage(formula, actor, statName, html) {
  const rollType = html.find("#rollType")[0].value;
  const rollCustom = rollType === "custom" ? html.find("#rollCustom")[0].value : "";

  let rollExpression;

  switch (rollType) {
    case "advantage":
      rollExpression = `2d20kh1${formula}`;
      break;
    case "disadvantage":
      rollExpression = `2d20kl1${formula}`;
      break;
    case "custom":
      rollExpression = rollCustom;
      break;
    default:
      rollExpression = `1d20${formula}`;
      break;
  }

  let roll = new Roll(rollExpression);
  const label = `${game.i18n.localize("FI.System.Rolling.Roll")}: ${statName}`;

  return roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: label,
  });
}

function handleSimpleRoll(formula, actor, statName) {
  let roll = new Roll(`1d20${formula}`);
  const label = `${game.i18n.localize("FI.System.Rolling.Roll")}: ${statName}`;

  return roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: label,
  });
}

function handleStatRoll(data) {
  logToConsole("info", "Roll", "Handling stat roll", data);
  let formula = data.formula;
  let statName = game.i18n.localize(`FI.Stat.${data.stat}`) + data.stance;

  prepareRoll(formula, data, statName);
}

async function handleItemCardRoll(data) {
  const template = await loadTemplate(
    "/systems/firardfortress/templates/parts/messages/itemCard.hbs"
  );
  const contentHtml = template({
    item: data.item,
    actor: data.actor,
  });

  let chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor: data.actor }),
    content: contentHtml,
    flags: {
      customType: "itemCard",
    },
  };

  ChatMessage.create(chatData);
}

async function handleAdventureRoll(data) {
  const balance = handleAdventureBalance(data.item, data.item.isGM);
  if (!balance) {
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: `<h2>${game.i18n.localize("FI.Adventure.DiceRoll")}</h2> <p>${game.i18n.localize("FI.Adventure.DiceRollNoBalance")}</p>`,
    });
    return;
  }
  let roll = new Roll("1d4");
  await roll.evaluate();
  const result = roll.result;
  if (result == 1 || result == 2 || result == 3 || result == 4) {
    adventureDiceMessageRender(roll, result, data);
  } else {
    adventureDiceMessageRender(roll, "Error", data);
  }
}

function adventureDiceMessageRender(roll, result, data) {
  let contentHtml = `<h2>${game.i18n.localize("FI.Adventure.DiceRoll")}</h2> <p>${game.i18n.localize(`FI.Adventure.DiceRollResult${result}`)}</p>`;

  let chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor: data.actor }),
    content: contentHtml,
    roll: roll,
  };

  if (game.modules.get("dice-so-nice")?.active) {
    game.dice3d.showForRoll(roll).then((displayed) => ChatMessage.create(chatData));
  } else {
    ChatMessage.create(chatData);
  }
}

export { handleRoll };
