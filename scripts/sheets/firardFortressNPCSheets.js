import firardFortressActorSheet from "./firardFortressActorSheets.js";

export default class firardFortressNPCSheet extends firardFortressActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["firardfortress", "sheet", "actor", "npc"],
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
