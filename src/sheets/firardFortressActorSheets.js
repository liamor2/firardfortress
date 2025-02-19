import { gsap } from "/scripts/greensock/esm/all.js";
import { Draggable } from "/scripts/greensock/esm/Draggable.js";
import {
  statBarAnimation,
  registerGlobalAnimations,
  navBarAnimation,
  navBarAnimationDefault,
} from "../logic.old/actorSheetAnimations.js";
import { handleRoll } from "../logic.old/roll.js";
import { handleAddItem, handleDeleteItem } from "../logic.old/actorManager.js";
import FirardFortressActor from "../objects.old/firardFortressActor.js";
import { logToConsole } from "../logic.old/helper.js";

gsap.registerPlugin(Draggable);

export default class firardFortressActorSheet extends ActorSheet {
  constructor(...args) {
    super(...args);

    this.hasBeenRendered = false;
    this.oldData = null;
  }

  get template() {
    logToConsole("info", "Sheet", `Loading ${this.actor.type} sheet`, null, "green");

    return `systems/firardfortressdev/templates/sheets/actors/${this.actor.type}-sheets.hbs`;
  }

  async getData() {
    const baseData = super.getData();
    const actor = this.actor;
    if (actor instanceof FirardFortressActor) {
      actor._prepareCharacterData(baseData.actor);
    }
    this.dataHasBeenUpdated = JSON.stringify(baseData) !== JSON.stringify(this.oldData);

    return baseData;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 800,
      height: 880,
      classes: ["firardfortressdev", "sheet", "item"],
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "main",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  async close(options = {}) {
    this.hasBeenRendered = false;
    this.dataHasBeenUpdated = false;
    this.oldData = null;
    return super.close(options);
  }

  async activateListeners(html) {
    super.activateListeners(html);

    // click listeners
    html.find(".rollable").click(handleRoll);
    html.find(".add").click(handleAddItem);
    html.find(".delete").click(handleDeleteItem);
    html.find(".edit-item").click(this._onEditItem.bind(this));
    html.find(".item-checkbox").click(this._onEquipItem.bind(this));
    html.find(".move").click(this._onMove.bind(this));
    html.find(".item").click(navBarAnimation.bind(this));

    // hover listeners

    // input listeners
    html.find(".item-input").change(this._onUpdateItem.bind(this));
    document.querySelectorAll('input:not([type="checkbox"])').forEach((inputField) => {
      inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          inputField.blur();
        }
      });
    });

    // change listeners

    // submit listeners

    // other listeners
    const data = await this.getData();
    if (!this.hasBeenRendered || this.dataHasBeenUpdated) {
      await statBarAnimation(data.actor, this.oldData, html);
      this.oldData = JSON.parse(JSON.stringify(data));
      this.hasBeenRendered = true;
    }

    navBarAnimationDefault(data, html);
    registerGlobalAnimations();
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  async _onDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    const item = this.actor.items.get(dataset.id);

    if (item) {
      await item.delete();
    } else {
      logToConsole("warn", "Actor Manager", `No item found with ID ${dataset.id} for deletion.`);
    }

    let updateData = {};

    this.object.update(updateData);
  }

  _onEditItem(event) {
    const item = this.actor.items.get(event.currentTarget.dataset.id);
    item.sheet.render(true);
  }

  _onUpdateItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.dataset.id;
    const item = this.actor.items.get(itemId);
    const field = element.dataset.field;
    const value = element.value;

    return item.update({ [field]: value });
  }

  _onEquipItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const item = this.actor.items.get(element.dataset.id);
    const type = `system.${element.dataset.type}`;
    item.update({ [type]: !item.system[element.dataset.type] });
  }

  _onMove(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const { type, move } = element.dataset;
  
    if (type === "up" || type === "down") {
      this.moveItem(element.dataset, move, type);
    }
  }

  // move item
  async moveItem(dataset, type, direction) {
    const data = await this.getData();
    const itemsOfType = data.items.filter((item) => item.type === type);

    const index = itemsOfType.findIndex((item) => item._id === dataset.id);
    if (index !== -1) {
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      
      if (swapIndex >= 0 && swapIndex < itemsOfType.length) {
        [itemsOfType[index], itemsOfType[swapIndex]] = [itemsOfType[swapIndex], itemsOfType[index]];

        await this.actor.updateEmbeddedDocuments(
          "Item",
          itemsOfType.map((item, i) => ({ _id: item._id, sort: i }))
        );
      }
    }
  }
}
