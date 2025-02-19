import { handleRoll } from "../logic.old/roll.js";
import { handleAdd, handleDelete } from "../logic.old/itemManager.js";
import { logToConsole } from "../logic.old/helper.js";

export default class firardFortressItemSheet extends ItemSheet {
  get template() {
    logToConsole("info", "Sheet", `Loading ${this.item.type} sheet`, null, "green");

    return `systems/firardfortressdev/templates/sheets/items/${this.item.type}-sheet.hbs`;
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
    html.find(".item-delete").click(handleDelete);
    html.find(".item-add").click(handleAdd);

    // input listeners
    document.querySelectorAll('input:not([type="checkbox"])').forEach(inputField => {
      inputField.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          inputField.blur();
        }
      });
    });
  }

  _onItemDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);

    item.delete();
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
}
