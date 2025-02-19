export abstract class FirardActorSheet extends ActorSheet {
  constructor(...args: ConstructorParameters<typeof ActorSheet>) {
    super(...args);
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

  get template() {
    logger.info(`Firard Fortress | Actor Sheet | Getting template for ${this.actor.type}`);

    return `systems/firardfortressdev/templates/sheets/actors/${this.actor.type}-sheets.hbs`;
  }
}
