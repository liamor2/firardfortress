import { logToConsole } from "./helper.js";

const optionKeys = {
  equipment: ["Armor", "Head", "Torso", "Arms", "Legs", "Feet", "Hands", "Shield", "Trinket", "Ring", "Necklace", "Belt", "Cloak", "Earring", "Bracelet"],
  hybrid: ["Physical", "Magical"],
  passif: ["Conditional", "Permanent", "Temporary"],
  proficiency: ["Physical", "Social", "Mental"],
  skill: ["Combat", "Movement", "Stealth", "Survival", "Tactical", "Weapon"],
  spell: ["Abjuration", "Alteration", "Charm", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Invocation", "Necromancy", "Restoration", "Transmutation"],
  transformation: ["Elemental", "Racial", "Class"],
  weapon: ["Axe", "Bow", "Crossbow", "Dagger", "Gun", "Hammer", "Mace", "Martial", "Polearm", "Spear", "Staff", "Sword", "Throwing", "Whip"]
};

function prepareOptions(itemType) {
  const keys = optionKeys[itemType.toLowerCase()];
  if (!keys) {
    logToConsole("info", "Prepare Item Type", `No options found for itemType '${itemType}'.`, null, "orange");
    return [];
  }
  return keys.map(key => ({
    title: key,
    value: game.i18n.localize(`FI.${itemType}Type.${key}`)
  }));
}

export { prepareOptions };