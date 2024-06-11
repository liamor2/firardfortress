import { gsap } from "/scripts/greensock/esm/all.js";
import { prepareOptions } from "../logic/prepareItemType.js";
import {
  validateAdventureDiceData,
  validateEquipmentData,
  validateHybridData,
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
  createMoneyData,
} from "../logic/dataCalculator.js";
import { handleRoll } from "../logic/roll.js";

export default class firardFortressItemSheet extends ItemSheet {
  get template() {
    console.log(`firardFortress | Loading ${this.item.type} sheet`);

    return `systems/firardfortressdev/templates/sheets/items/${this.item.type}-sheet.hbs`;
  }

  async getData() {
    const data = super.getData();
    data.config = CONFIG.firardFortress;
    data.isGM = game.user.isGM;

    data.itemOptions = prepareOptions(data.item.type);

    console.log(data);
    this.verifyData(data);
    this.createCalculatedData(data.data.system);

    return data;
  }

  static get defaultOptions() {
    const defaultOptions = super.defaultOptions;

    return foundry.utils.mergeObject(defaultOptions, {
      width: "auto",
      height: "auto",
      resizable: false,
      classes: ["sheet", "item-sheet"],
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "main",
        },
      ],
    });
  }

  async close(options = {}) {
    return super.close(options);
  }

  activateListeners(html) {
    super.activateListeners(html);

    // click listeners
    html.find(".rollable").click(handleRoll);
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    html.find(".roll-delete").click(this._onRollDelete.bind(this));
    html.find(".item-add").click(this._onItemAdd.bind(this));
  }

  _onItemDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);

    item.delete();
  }

  _onRollDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const item = this.object;

    let rolls = item.system.roll;
    if (!Array.isArray(rolls)) {
      rolls = Object.values(rolls);
    }
    rolls.splice(dataset.index, 1);
    item.update({
      "system.roll": rolls,
    });
    this.render();
  }

  async _onItemAdd(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const data = await this.getData();

    switch (dataset.add) {
      case "spell":
        this.addSpellRoll(data, "Fire");
        break;
      case "skill":
        this.addSpellRoll(data, "Physical");
        break;
      case "hybrid":
        this.addSpellRoll(data, "Piercing");
        break;
      case "weapon":
        this.addSpellRoll(data, "Slashing");
        break;
      default:
        break;
    }
  }

  _updateObject(event, formData) {
    return this.object.update(formData);
  }

  _onDrop(event) {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer.getData("text/plain"));

    if (data.type === "Item") {
      this.actor.createOwnedItem(data);
    }
  }

  _onDragOver(event) {
    event.preventDefault();
  }

  _onDragLeave(event) {
    event.preventDefault();
  }

  _onDragEnter(event) {
    event.preventDefault();
  }

  createCalculatedData(data) {
    this.data = {
      AdventureDice: createAdventureDiceData,
      Money: createMoneyData,
    }[this.item.type]?.(data);
  }

  verifyData(data) {
    this.data = {
      AdventureDice: validateAdventureDiceData,
      Equipment: validateEquipmentData,
      Hybrid: validateHybridData,
      Misc: validateMiscData,
      Money: validateMoneyData,
      Passif: validatePassifData,
      Proficiency: validateProficiencyData,
      Skill: validateSkillData,
      Spell: validateSpellData,
      Transformation: validateTransformationData,
      Weapon: validateWeaponData,
    }[this.item.type]?.(data);
  }
}
