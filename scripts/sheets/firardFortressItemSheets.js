import { gsap } from "/scripts/greensock/esm/all.js";

export default class firardFortressItemSheet extends ItemSheet {
    get template() {
        console.log(`firardFortress | Loading ${this.item.type} sheet`);

        return `systems/firardfortress/templates/sheets/items/${this.item.type}-sheet.hbs`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.firardFortress;
        this.createCalculatedData(data);
        console.log(data);
        console.log(this);
        data.isGM = game.user.isGM;
        return data;
    }

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;

        return mergeObject(defaultOptions, {
            classes: ['firardfortress', 'sheet', 'item'],
            tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }]
        });
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.item-roll').click(this._onItemRoll.bind(this));
        html.find('.item-delete').click(this._onItemDelete.bind(this));
    }

    _onItemDelete(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);

        item.delete();
    }

    _updateObject(event, formData) {
        return this.object.update(formData);
    }

    _onDrop(event) {
        event.preventDefault();

        const data = JSON.parse(event.dataTransfer.getData('text/plain'));

        if (data.type === 'Item') {
            this.actor.createOwnedItem(data.data);
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

    _onItemRoll(event) {
        event.preventDefault();

        const element = event.currentTarget;
        const dataset = element.dataset;
        const item = this.object;

        switch (item.type) {
            case 'AdventureDice':
                this.adventureDiceRoll(event, item, dataset);
                break;
            default:
                break;
        }
    }

    adventureDiceRoll(event, item, dataset) {
        if (game.user.isGM && item.system.GMBalance != 0) {
            item.system.heroBalance++;
            item.system.GMBalance--;
        } else if (!game.user.isGM && item.system.heroBalance != 0) {
            item.system.GMBalance++;
            item.system.heroBalance--;
        } else {
            ChatMessage.create({
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: `<h2>${game.i18n.localize("FI.AdventureDiceRoll")}</h2> <p>${game.i18n.localize("FI.AdventureDiceRollNoBalance")}</p>`,
            })
            return;
        }
        let roll = new Roll('1d4');
        roll.roll();
        const result = roll.result;
        if (result == 1 || result == 2 || result == 3 || result == 4) {
            this.adventureDiceMessageRender(roll, result);
        } else {
            this.adventureDiceMessageRender(roll, "Error");
        }

        this.render();
        item.update({ "system": item.system });
    }

    adventureDiceMessageRender(roll, result) {
        if (game.dice3d) {
            game.dice3d.showForRoll(roll).then(displayed => ChatMessage.create({
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: `<h2>${game.i18n.localize("FI.AdventureDiceRoll")}</h2> <p>${game.i18n.localize(`FI.AdventureDiceRollResult${result}`)}</p>`,
                roll
            }));
        } else {
            ChatMessage.create({
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: `<h2>${game.i18n.localize("FI.AdventureDiceRoll")}</h2> <p>${game.i18n.localize(`FI.AdventureDiceRollResult${result}`)}</p>`,
                roll
            })
        }
    }


    createCalculatedData(data) {
        switch (this.item.type) {
            case "AdventureDice":
                this.createAdventureDiceData(data);
                break;
            default:
                break;
        }
    }

    createAdventureDiceData(data) {
        if (data.data.system.GMBalance == null) data.data.system.GMBalance = 0;
        if (data.data.system.heroBalance == null) data.data.system.heroBalance = 0;
        if (data.data.system.GMBalance < 0) data.data.system.GMBalance = 0;
        if (data.data.system.heroBalance < 0) data.data.system.heroBalance = 0;
        if (data.data.system.heroBalance + data.data.system.GMBalance <= 2) {
            data.data.system.GMBalance = 1;
            data.data.system.heroBalance = 2;
        }
        data.data.system.total = parseInt(data.data.system.GMBalance) + parseInt(data.data.system.heroBalance);
        
        data.data.system.segments = {};

        for (let i = 0; i <= data.data.system.total-1; i++) {
            data.data.system.segments[i] = false;
        }

        for (let i = 0; i <= data.data.system.GMBalance-1; i++) {
            data.data.system.segments[i] = true;
        }
    }
}