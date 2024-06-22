import firardFortressActorSheet from "./sheets/firardFortressActorSheets.js";
import firardFortressNPCSheet from "./sheets/firardFortressNPCSheets.js";
import firardFortressItemSheet from "./sheets/firardFortressItemSheets.js";
import firardFortressActor from "./objects/firardFortressActor.js";
import firardFortressItem from "./objects/firardFortressItem.js";
import { handleRoll } from "./logic/roll.js";

async function preloadHandlebarsPartials() {
  const basePath = "systems/firardfortressdev/templates/parts";
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
  console.log("firardfortressdev | Initializing firardfortressdev");

  CONFIG.Actor.documentClass = firardFortressActor;
  CONFIG.Item.documentClass = firardFortressItem;

  CONFIG.statusEffects.push(
    {
      id: "Offensive",
      name: "Stance: Offensive",
      img: "systems/firardfortressdev/icons/Offensive.png",
      flags: { group: "stance", stanceId: "Offensive" },
    },
    {
      id: "Defensive",
      name: "Stance: Defensive",
      img: "systems/firardfortressdev/icons/Defensive.png",
      flags: { group: "stance", stanceId: "Defensive" },
    },
    {
      id: "Focus",
      name: "Stance: Focus",
      img: "systems/firardfortressdev/icons/Focus.png",
      flags: { group: "stance", stanceId: "Focus" },
    },
    {
      id: "Concentration",
      name: "Stance: Concentration",
      img: "systems/firardfortressdev/icons/Concentration.png",
      flags: { group: "stance", stanceId: "Concentration" },
    },
    {
      id: "Elemental",
      name: "Stance: Elemental",
      img: "systems/firardfortressdev/icons/Elemental.png",
      flags: { group: "stance", stanceId: "Elemental" },
    }
  );

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("firardfortressdev", firardFortressActorSheet, {
    makeDefault: true,
  });
  Actors.registerSheet("firardfortressdev", firardFortressNPCSheet, {
    types: ["NPC"],
    makeDefault: true,
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("firardfortressdev", firardFortressItemSheet, {
    makeDefault: true,
  });

  Handlebars.registerHelper("or", function (...args) {
    args.pop();
    return args.some((arg) => Boolean(arg));
  });

  Handlebars.registerHelper('colSpan', function (type) {
    return type === "NPC" ? "" : 'colspan="4"';
  });

  game.settings.register("firardfortressdev", "system", {
    name: "System",
    hint: "System",
    scope: "world",
    config: false,
    type: String,
    default: "firardfortressdev",
  });

  game.settings.register("firardfortressdev", "enableAdvanceRolls", {
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
  console.log("firardfortressdev | Ready");

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