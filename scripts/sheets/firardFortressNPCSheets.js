import firardFortressDevActorSheet from "./firardFortressDevActorSheets.js";

export default class firardFortressDevNPCSheet extends firardFortressDevActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["firardfortressdev", "sheet", "actor", "npc"],
      width: 580,
      height: 510,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
    });
  }
}
