import firardFortressActorSheet from "./sheets/firardFortressActorSheets.js";
import firardFortressNPCSheet from "./sheets/firardFortressNPCSheets.js";
import firardFortressItemSheet from "./sheets/firardFortressItemSheets.js";
import firardFortressActor from "./objects/firardFortressActor.js";

async function preloadHandlebarsPartials() {
  const templatePaths = [
    "systems/firardfortress/templates/parts/actors/header/subStat.hbs",
    "systems/firardfortress/templates/parts/actors/header/mainStat.hbs",
    "systems/firardfortress/templates/parts/actors/header/attributes.hbs",
    "systems/firardfortress/templates/parts/actors/header/navigation.hbs",
    "systems/firardfortress/templates/parts/actors/tabs/mainTab.hbs",
    "systems/firardfortress/templates/parts/actors/tabs/proficienciesTab.hbs",
    "systems/firardfortress/templates/parts/actors/tabs/spellsTab.hbs",
    "systems/firardfortress/templates/parts/actors/tabs/notesTab.hbs",
    "systems/firardfortress/templates/parts/actors/tabs/npcAttackTab.hbs",
    "systems/firardfortress/templates/parts/actors/footer/advancedRoll.hbs",
    "systems/firardfortress/templates/parts/items/header.hbs",
    "systems/firardfortress/templates/parts/items/capacitiesCost.hbs",
    "systems/firardfortress/templates/parts/items/roll.hbs",
    "systems/firardfortress/templates/parts/items/description.hbs",
    "systems/firardfortress/templates/parts/items/typeInput.hbs",
    "systems/firardfortress/templates/parts/items/navigation.hbs",
    "systems/firardfortress/templates/parts/items/details.hbs",
    "systems/firardfortress/templates/parts/items/statInput.hbs",
  ];

  return loadTemplates(templatePaths);
}

Hooks.once("init", async function () {
  console.log("firardfortress | Initializing firardfortress");

  CONFIG.Actor.documentClass = firardFortressActor;

  CONFIG.statusEffects.push(
    {
      id: "Offensive",
      name: "Stance: Offensive",
      img: "systems/firardfortress/icons/Offensive.png",
      flags: { group: "stance", stanceId: "Offensive" },
    },
    {
      id: "Defensive",
      name: "Stance: Defensive",
      img: "systems/firardfortress/icons/Defensive.png",
      flags: { group: "stance", stanceId: "Defensive" },
    },
    {
      id: "Focus",
      name: "Stance: Focus",
      img: "systems/firardfortress/icons/Focus.png",
      flags: { group: "stance", stanceId: "Focus" },
    },
    {
      id: "Concentration",
      name: "Stance: Concentration",
      img: "systems/firardfortress/icons/Concentration.png",
      flags: { group: "stance", stanceId: "Concentration" },
    },
    {
      id: "Elemental",
      name: "Stance: Elemental",
      img: "systems/firardfortress/icons/Elemental.png",
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

Hooks.on("createItem", (item) => {
  switch (item.type) {
    case "Weapon":
      item.update({
        img: "icons/weapons/swords/greatsword-crossguard-steel.webp",
      });
      break;
    case "Equipment":
      item.update({
        img: "icons/equipment/chest/breastplate-cuirass-steel-grey.webp",
      });
      break;
    case "Misc":
      item.update({
        img: "icons/containers/bags/pack-leather-black-brown.webp",
      });
      break;
    case "Money":
      item.update({
        img: "icons/commodities/currency/coin-inset-compass-silver.webp",
      });
      break;
    case "Proficiency":
      item.update({
        img: "icons/skills/social/intimidation-impressing.webp",
      });
      break;
    case "Spell":
      item.update({
        img: "icons/magic/fire/explosion-embers-orange.webp",
      });
      break;
    case "Skill":
      item.update({
        img: "icons/skills/melee/hand-grip-sword-orange.webp",
      });
      break;
    case "Hybrid":
      item.update({
        img: "icons/magic/unholy/hand-fire-skeleton-pink.webp",
      });
      break;
    case "Transformation":
      item.update({
        img: "icons/magic/holy/angel-winged-humanoid-blue.webp",
      });
      break;
    case "Passif":
      item.update({
        img: "icons/magic/perception/eye-ringed-glow-angry-large-red.webp",
      });
      break;
    case "AdventureDice":
      item.update({
        img: "icons/svg/d4-grey.svg",
      });
      break;
    default:
      break;
  }
});
