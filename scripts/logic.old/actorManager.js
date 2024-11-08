import { calculateStanceModifier } from "./dataCalculator.js";
import { logToConsole } from "./helper.js";

function getActorData(dataset) {
  let data = fetchActorData(dataset.id);
  return formatActorData(dataset.stat, data);
}

function fetchActorData(id) {
  return game.actors.get(id);
}

function calculateModifierValue(stat, data) {
  return Math.floor((data.system.stat[stat].value - 10) / 2);
}

function formatModifier(statMod, stanceMod, data) {
  let modifier = `${statMod >= 0 ? "+" : ""}${statMod}${stanceMod.mod}`;
  return modifier;
}

function calculateModifier(stat, data) {
  let statMod = calculateModifierValue(stat, data);
  let stanceMod = calculateStanceModifier(stat, data);
  let formula = formatModifier(statMod, stanceMod, data);
  return {
    formula: formula,
    stance: stanceMod.stance,
  };
}

function formatActorData(stat, data) {
  let modifierData = calculateModifier(stat, data);

  return {
    stat: stat,
    formula: modifierData.formula,
    stance: modifierData.stance,
  };
}

function handleAddItem(event) {
  event.preventDefault();
  const element = event.currentTarget;
  const dataset = element.dataset;

  const rollTemplate = {
    dice: 1,
    type: "d6",
    bonus: 0,
    damageType: `${game.i18n.localize(`FI.${dataset.add}.DefaultDamageType`)}`,
  };

  const rangedTemplate = {
    ranged: false,
    min: 0,
    max: 1,
  };

  const statLinkedTemplate = {
    stat: "None",
    value: 0,
  };

  const itemTemplate = {
    weight: 0,
    price: 0,
    quantity: 1,
    rarity: `${game.i18n.localize("FI.Rarities.Common")}`,
  };

  const generateItemTemplate = (type, dataOverrides = {}) => ({
    name: `${game.i18n.localize(`FI.${type}.New${type}`)}`,
    type: type,
    system: {
      description: "",
      isSpell: type === "Spell",
      isSKill: type === "Skill",
      isHybrid: type === "Hybrid",
      isTransformation: type === "Transformation",
      isPassif: type === "Passif",
      isProficiency: type === "Proficiency",
      isWeapon: type === "Weapon",
      isEquipment: type === "Equipment",
      isMisc: type === "Misc",
      isMoney: type === "Money",
      isLanguage: type === "Language",
      ...dataOverrides,
    },
  });

  const itemDataOverrides = {
    Equipment: {
      PA: 0,
      MA: 0,
      equipped: false,
      equipmentType: `${game.i18n.localize("FI.Equipment.DefaultType")}`,
      ...itemTemplate,
    },
    Hybrid: {
      mpCost: 0,
      spCost: 0,
      hpCost: 0,
      otherCost: "",
      range: rangedTemplate,
      roll: {
        0: rollTemplate,
      },
      ...statLinkedTemplate,
    },
    Money: {
      localization: "",
      value: 0,
      ...itemTemplate,
    },
    Passif: {
      passifType: `${game.i18n.localize("FI.Passif.DefaultType")}`,
    },
    Proficiency: {
      proficiencyType: `${game.i18n.localize("FI.Proficiency.DefaultType")}`,
      ...statLinkedTemplate,
    },
    Skill: {
      spCost: 0,
      skillType: `${game.i18n.localize("FI.Skill.DefaultType")}`,
      range: rangedTemplate,
      roll: {
        0: rollTemplate,
      },
      ...statLinkedTemplate,
    },
    Spell: {
      mpCost: 1,
      spellType: `${game.i18n.localize("FI.Spell.DefaultType")}`,
      range: rangedTemplate,
      roll: {
        0: rollTemplate,
      },
      ...statLinkedTemplate,
    },
    Transformation: {
      mpCost: 0,
      spCost: 0,
      hpCost: 0,
      otherCost: "",
      transformationType: `${game.i18n.localize("FI.Transformation.DefaultType")}`,
      ...statLinkedTemplate,
    },
    Weapon: {
      weaponType: `${game.i18n.localize("FI.Weapon.DefaultType")}`,
      equipped: false,
      range: rangedTemplate,
      roll: {
        0: rollTemplate,
      },
      ...statLinkedTemplate,
      ...itemTemplate,
    },
    Language: {
      speaking: false,
      writing: false,
      reading: false,
    },
  };

  const newItem = generateItemTemplate(dataset.add, itemDataOverrides[dataset.add]);

  if (newItem) {
    game.actors.get(dataset.actor).createEmbeddedDocuments("Item", [newItem]);
  }
}

async function handleDeleteItem(event) {
  const element = event.currentTarget;
  const dataset = element.dataset;

  const item = game.actors.get(dataset.actor).items.get(dataset.id);
  if (item) {
    logToConsole("info", "Actor Manager", `Deleting ${dataset.delete}: ${dataset.id}`);
    await item.delete();
  } else {
    logToConsole("warn", "Actor Manager", `No item found with ID ${dataset.id} for deletion.`);
  }
}

async function moveItem() {
}

export { getActorData, handleAddItem, handleDeleteItem, moveItem };
