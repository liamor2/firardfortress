import firardFortressActorSheet from "./sheets/firardFortressActorSheets.js";
import firardFortressNPCSheet from "./sheets/firardFortressNPCSheets.js";
import firardFortressItemSheet from "./sheets/firardFortressItemSheets.js";
import firardFortressActor from "./objects/firardFortressActor.js";
import firardFortressItem from "./objects/firardFortressItem.js";
import { handleRoll } from "./logic/roll.js";

async function preloadHandlebarsPartials() {
  const basePath = "systems/firardfortress/templates/parts";
  const templates = [
    "actors/header/mainStat.hbs",
    "actors/header/subStat.hbs",
    "actors/header/attributes.hbs",
    "actors/header/navigation.hbs",
    "actors/header/statDisplay.hbs",
    "actors/tabs/mainTab.hbs",
    "actors/tabs/proficienciesTab.hbs",
    "actors/tabs/spellsTab.hbs",
    "actors/tabs/notesTab.hbs",
    "actors/tabs/npcAttackTab.hbs",
    "actors/tabs/itemRows.hbs",
    "actors/footer/advancedRoll.hbs",
    "items/header.hbs",
    "items/capacitiesCost.hbs",
    "items/roll.hbs",
    "items/description.hbs",
    "items/typeInput.hbs",
    "items/navigation.hbs",
    "items/details.hbs",
    "items/statInput.hbs",
    "items/ranged.hbs"
  ];

  const templatePaths = templates.map((template) => `${basePath}/${template}`);
  return loadTemplates(templatePaths);
}

Hooks.once("init", async function () {
  console.log("firardfortress | Initializing firardfortress");

  CONFIG.Actor.documentClass = firardFortressActor;
  CONFIG.Item.documentClass = firardFortressItem;

  CONFIG.statusEffects.push(
    {
      id: "Offensive",
      name: "Stance: Offensive",
      img: "systems/firardfortress/assets/Offensive.png",
      flags: { group: "stance", stanceId: "Offensive" },
    },
    {
      id: "Defensive",
      name: "Stance: Defensive",
      img: "systems/firardfortress/assets/Defensive.png",
      flags: { group: "stance", stanceId: "Defensive" },
    },
    {
      id: "Focus",
      name: "Stance: Focus",
      img: "systems/firardfortress/assets/Focus.png",
      flags: { group: "stance", stanceId: "Focus" },
    },
    {
      id: "Concentration",
      name: "Stance: Concentration",
      img: "systems/firardfortress/assets/Concentration.png",
      flags: { group: "stance", stanceId: "Concentration" },
    },
    {
      id: "Elemental",
      name: "Stance: Elemental",
      img: "systems/firardfortress/assets/Elemental.png",
      flags: { group: "stance", stanceId: "Elemental" },
    }
  );

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("firardfortress", firardFortressActorSheet, {
    makeDefault: true,
  });
  Actors.registerSheet("firardfortress", firardFortressNPCSheet, {
    types: ["NPC"],
    makeDefault: true,
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("firardfortress", firardFortressItemSheet, {
    makeDefault: true,
  });

  Handlebars.registerHelper("or", function (...args) {
    args.pop();
    return args.some((arg) => Boolean(arg));
  });

  Handlebars.registerHelper('colSpan', function (type) {
    return type === "NPC" ? "" : 'colspan="4"';
  });

  game.settings.register("firardfortress", "system", {
    name: "System",
    hint: "System",
    scope: "world",
    config: false,
    type: String,
    default: "firardfortress",
  });

  game.settings.register("firardfortress", "enableAdvanceRolls", {
    name: "Enable Advanced Rolls",
    hint: "Enable for a higher level of automation and customization for your rolls.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  await preloadHandlebarsPartials();
});

Hooks.once("ready", async function () {
  console.log("firardfortress | Ready");

  CONFIG.Combat.initiative = {
    formula: "@initiative.formula",
    decimals: 2,
  };
});

Hooks.on("renderChatMessage", (message, html, data) => {
  if (message.flags.customType === "itemCard") {
    html.find(".rollable").click(handleRoll);
  }
});