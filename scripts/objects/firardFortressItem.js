import { prepareOptions } from "../logic/prepareItemType.js";
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
} from "../logic/dataValidator.js";
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
} from "../logic/dataCalculator.js";

export default class firardFortressItem extends Item {
  constructor(...args) {
    super(...args);
  }

  async getData() {
    const data = super.getData();

    return data;
  }

  async prepareData() {
    super.prepareData();

    const itemData = this.system;
    const itemType = this.type;
    const actorData = this.actor;

    this.isGM = game.user.isGM;
    // console.log(this);

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
  "Weapon": "assets/weapons/swords/greatsword-crossguard-steel.webp",
  "Equipment": "assets/equipment/chest/breastplate-cuirass-steel-grey.webp",
  "Misc": "assets/containers/bags/pack-leather-black-brown.webp",
  "Money": "assets/commodities/currency/coin-inset-compass-silver.webp",
  "Proficiency": "assets/skills/social/intimidation-impressing.webp",
  "Spell": "assets/magic/fire/explosion-embers-orange.webp",
  "Skill": "assets/skills/melee/hand-grip-sword-orange.webp",
  "Hybrid": "assets/magic/unholy/hand-fire-skeleton-pink.webp",
  "Transformation": "assets/magic/holy/angel-winged-humanoid-blue.webp",
  "Passif": "assets/magic/perception/eye-ringed-glow-angry-large-red.webp",
  "AdventureDice": "assets/svg/d4-grey.svg"
};

Hooks.on("createItem", (item) => {
  if (itemIcons[item.type]) {
    item.update({ img: itemIcons[item.type] });
  }
});