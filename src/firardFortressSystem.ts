import { PCData } from "@app/models";
import { FirardActorSheet, PCActorSheet } from "@app/sheets";

type FirardSettingsKeys = "system" | "enableAdvanceRolls";

interface SettingConfig {
  key: FirardSettingsKeys;
  options: ClientSettings.RegisterOptions<string | boolean>;
}

const SYSTEM_ID = "firardfortressdev";

function preloadHandlebarsTemplates() {
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
    "items/ranged.hbs",
  ];

  const templatePaths = templates.map((template) => `${basePath}/${template}`);
  return loadTemplates(templatePaths);
}

Hooks.on("init", async function () {
  logger.info("Firard Fortress | Initializing Firard Fortress");

  registerActors();
  registerItems();
  registerSystemData();

  await preloadHandlebarsTemplates();
});

function registerActors() {
  registerActorsModel();
  registerActorsSheets();
}

function registerItems() {
  registerItemsModel();
}

function registerSystemData() {
  registerCustomStatusEffects();
  registerHandlebarsHelpers();
  registerGameSettings();
}

function registerActorsModel() {
  CONFIG.Actor.dataModels.PC = PCData;
}

function registerActorsSheets() {
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(SYSTEM_ID, FirardActorSheet, { makeDefault: true });
  Actors.registerSheet(SYSTEM_ID, PCActorSheet, { makeDefault: true, types: ["PC"] });
}

function registerItemsModel() {}

function registerCustomStatusEffects() {
  const statusEffects: CONFIG.StatusEffect[] = [
    {
      id: "Aggressive",
      name: "Aggressive",
      icon: "systems/firardfortressdev/assets/Aggressive.png",
    },
    {
      id: "Defensive",
      name: "Defensive",
      icon: "systems/firardfortressdev/assets/Defensive.png",
    },
    {
      id: "Focus",
      name: "Focus",
      icon: "systems/firardfortressdev/assets/Focus.png",
    },
    {
      id: "Concentration",
      name: "Concentration",
      icon: "systems/firardfortressdev/assets/Concentration.png",
    },
    {
      id: "Elemental",
      name: "Elemental",
      icon: "systems/firardfortressdev/assets/Elemental.png",
    },
  ];

  CONFIG.statusEffects.push(...statusEffects);
}

function registerHandlebarsHelpers(): void {
  Handlebars.registerHelper({
    or: (...args: unknown[]): boolean => args.slice(0, -1).some(Boolean),
    colSpan: (type: string): string => (type === "NPC" ? "" : 'colspan="4"'),
  });
}

function registerGameSettings(): void {
  const settings: SettingConfig[] = [
    {
      key: "system",
      options: {
        name: "System",
        hint: "System",
        scope: "world",
        config: false,
        type: String,
        default: SYSTEM_ID,
      },
    },
    {
      key: "enableAdvanceRolls",
      options: {
        name: "Enable Advanced Rolls",
        hint: "Enable for a higher level of automation and customization for your rolls.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
      },
    },
  ];

  settings.forEach((setting) => {
    game.settings?.register(SYSTEM_ID, setting.key, setting.options);
  });
}
