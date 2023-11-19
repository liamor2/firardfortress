export default class firardFortressActorSheet extends ActorSheet {
    get template() {
        console.log(`firardFortress | Loading ${this.actor.type} sheet`);
        // console.log(this.actor);

        return `systems/firardfortress/templates/sheets/actors/${this.actor.type}-sheets.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 520,
            height: 480,
            classes: ["firardFortress", "sheet", "item"]
        });
    }

    async getData() {
        const data = super.getData();
        data.config = CONFIG.firardFortress;
        for (let [key, value] of Object.entries(data.data.system.stat)) {
            value.mod.num = Math.floor((value.value - 10) / 2);
            if (value.mod.num >= 0) {
                value.mod.text = `+${value.mod.num}`;
            } else {
                value.mod.text = `${value.mod.num}`;
            }
        }
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.rollable').click(this._onRoll.bind(this));
    }

    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        let roll = new Roll(dataset.roll, this.actor.getRollData());
        console.log(roll);
        let label = dataset.label ? `Rolling ${dataset.label}` : '';
        return roll.toMessage({
            speaker: ChatMessage.getSpeaker({
                actor: this.actor
            }),
            flavor: label
        });
    }
}