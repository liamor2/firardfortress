import { prepareOptions } from "../logic.old/prepareItemType.js";
import {
  validateAdventureDiceData,
  validateEquipmentData,
  validateHybridData,
  validateLanguageData,
  validateMiscData,
  validateMoneyData,
  validatePassifData,
  validateProficiencyData,
  validateSkillData,
  validateSpellData,
  validateTransformationData,
  validateWeaponData,
} from "../logic.old/dataValidator.js";
import {
  createAdventureDiceData,
  createEquipmentData,
  createHybridData,
  createLanguageData,
  createMiscData,
  createMoneyData,
  createPassifData,
  createProficiencyData,
  createSkillData,
  createSpellData,
  createTransformationData,
  createWeaponData,
} from "../logic.old/dataCalculator.js";
import { logToConsole } from "../logic.old/helper.js";

export default class firardFortressItem extends Item {
  async prepareData() {
    super.prepareData();

    const itemData = this.system;
    const itemType = this.type;
    const actorData = this.actor;

    this.isGM = game.user.isGM;
    logToConsole("info", "Item", "Preparing data", itemData, "green");

    itemData.itemOptions = prepareOptions(itemType);

    this.verifyData(itemData);
    this.createCalculatedData(itemData, actorData);
  }

  createCalculatedData(data, actorData) {
    this.system = {
      AdventureDice: createAdventureDiceData,
      Equipment: createEquipmentData,
      Hybrid: createHybridData,
      Language: createLanguageData,
      Misc: createMiscData,
      Money: createMoneyData,
      Passif: createPassifData,
      Proficiency: createProficiencyData,
      Skill: createSkillData,
      Spell: createSpellData,
      Transformation: createTransformationData,
      Weapon: createWeaponData,
    }[this.type](data, actorData);
  }

  verifyData(data) {
    this.system = {
      AdventureDice: validateAdventureDiceData,
      Equipment: validateEquipmentData,
      Hybrid: validateHybridData,
      Language: validateLanguageData,
      Misc: validateMiscData,
      Money: validateMoneyData,
      Passif: validatePassifData,
      Proficiency: validateProficiencyData,
      Skill: validateSkillData,
      Spell: validateSpellData,
      Transformation: validateTransformationData,
      Weapon: validateWeaponData,
    }[this.type](data);
  }
}

const itemIcons = {
  "Weapon": "icons/weapons/swords/greatsword-crossguard-steel.webp",
  "Equipment": "icons/equipment/chest/breastplate-cuirass-steel-grey.webp",
  "Misc": "icons/containers/bags/pack-leather-black-brown.webp",
  "Money": "icons/commodities/currency/coin-inset-compass-silver.webp",
  "Proficiency": "icons/skills/social/intimidation-impressing.webp",
  "Spell": "icons/magic/fire/explosion-embers-orange.webp",
  "Skill": "icons/skills/melee/hand-grip-sword-orange.webp",
  "Hybrid": "icons/magic/unholy/hand-fire-skeleton-pink.webp",
  "Transformation": "icons/magic/holy/angel-winged-humanoid-blue.webp",
  "Passif": "icons/magic/perception/eye-ringed-glow-angry-large-red.webp",
  "AdventureDice": "icons/svg/d4-grey.svg"
};

Hooks.on("createItem", (item) => {
  if (itemIcons[item.type]) {
    item.update({ img: itemIcons[item.type] });
  }
});