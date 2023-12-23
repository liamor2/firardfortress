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
        data.isGM = game.user.isGM;
        this.verifyData(data);
        console.log(data);
        return data;
    }

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;

        return mergeObject(defaultOptions, {
            width: "auto",
            height: "auto",
            resizable: false,
            classes: ['sheet', 'item-sheet'],
            tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'main' }]
        });
    }

    async close(options = {}) {
        tinymce.remove();
        return super.close(options);
    }

    activateListeners(html) {
        super.activateListeners(html);

        // click listeners
        html.find('.item-roll').click(this._onItemRoll.bind(this));
        html.find('.item-delete').click(this._onItemDelete.bind(this));
        html.find('.roll-delete').click(this._onRollDelete.bind(this));
        html.find('.item-add').click(this._onItemAdd.bind(this));
    }

    _onItemDelete(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const itemId = element.closest('.item').dataset.itemId;
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
            rolls =  Object.values(rolls);
        }
        rolls.splice(dataset.index, 1);
        item.update({ "system.roll": rolls });
        this.render();
    }

    _onItemAdd(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        const data = this.getData();

        switch (dataset.add) {
            case 'spell':
                this.addSpellRoll(data, "Fire");
                break;
            case 'skill':
                this.addSpellRoll(data, "Physical");
                break;
            case 'hybrid':
                this.addSpellRoll(data, "Piercing");
                break;
            case 'weapon':
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
            case 'Spell':
                this.spellRoll(event, item, dataset, "Spell");
                break;
            case 'Skill':
                this.spellRoll(event, item, dataset, "Skill");
                break;
            case 'Hybrid':
                this.spellRoll(event, item, dataset, "Hybrid");
                break;
            case 'Weapon':
                this.spellRoll(event, item, dataset, "Weapon");
                break;
            default:
                break;
        }
    }

    verifyData(data) {
        data.data.name = data.data.system.name;
        data.document.name = data.data.system.name;
        data.item.name = data.data.system.name;
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
                content: `<h2>${game.i18n.localize("FI.Adventure.DiceRoll")}</h2> <p>${game.i18n.localize("FI.Adventure.DiceRollNoBalance")}</p>`,
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
                content: `<h2>${game.i18n.localize("FI.Adventure.DiceRoll")}</h2> <p>${game.i18n.localize(`FI.Adventure.DiceRollResult${result}`)}</p>`,
                roll
            }));
        } else {
            ChatMessage.create({
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: `<h2>${game.i18n.localize("FI.Adventure.DiceRoll")}</h2> <p>${game.i18n.localize(`FI.Adventure.DiceRollResult${result}`)}</p>`,
                roll
            })
        }
    }

    spellRoll(event, item, dataset, type) {
        let rollList = item.system.roll;
        let rollString = ``;
        if (!Array.isArray(rollList)) {
            rollList =  Object.values(rollList);
        }
        for (let i = 0; i < rollList.length; i++) {
            const dice = rollList[i].dice;
            const type = rollList[i].type;
            const bonus = rollList[i].bonus;
            const damageType = rollList[i].damageType;
            const roll = new Roll(`${dice}${type}`);
            roll.roll();
            if (game.dice3d) {
                game.dice3d.showForRoll(roll)
            }
            const result = parseInt(roll.result) + bonus;
            rollString += `</p> <p> ${dice}${type}+${bonus} = ${result} ${damageType} `;
        }
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>${game.i18n.localize(`FI.${type}.Roll`)}</h2> <p>${game.i18n.localize(`FI.${type}.RollResult`)} : ${rollString} </p>`
        })
    }

    createCalculatedData(data) {
        switch (this.item.type) {
            case "AdventureDice":
                this.createAdventureDiceData(data);
                break;
            case "Spell":
                this.createSpellData(data);
                break;
            case "Skill":
                this.createSkillData(data);
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

    createSpellData(data) {
        if (data.data.system.roll == null) data.data.system.roll = [];
        if (!Array.isArray(data.data.system.roll)) {
            data.data.system.roll =  Object.values(data.data.system.roll);
        }
        for (let i = 0; i < data.data.system.roll.length; i++) {
            const roll = data.data.system.roll[i];
            if (roll.dice == null) roll.dice = 1;
            if (roll.type == null) roll.type = "d6";
            if (roll.bonus == null) roll.bonus = 0;
            if (roll.damageType == null) roll.damageType = "Fire";
        }
        if (data.data.system.range.min < 0) data.data.system.range.min = 0;
        if (data.data.system.range.max < 0) data.data.system.range.max = 0;
        if (data.data.system.range.min > data.data.system.range.max) data.data.system.range.min = data.data.system.range.max;
    }

    createSkillData(data) {
        if (data.data.system.roll == null) data.data.system.roll = [];
        if (!Array.isArray(data.data.system.roll)) {
            data.data.system.roll =  Object.values(data.data.system.roll);
        }
        for (let i = 0; i < data.data.system.roll.length; i++) {
            const roll = data.data.system.roll[i];
            if (roll.dice == null) roll.dice = 1;
            if (roll.type == null) roll.type = "d6";
            if (roll.bonus == null) roll.bonus = 0;
            if (roll.damageType == null) roll.damageType = "Physical";
        }
        if (data.data.system.range.min < 0) data.data.system.range.min = 0;
        if (data.data.system.range.max < 0) data.data.system.range.max = 0;
        if (data.data.system.range.min > data.data.system.range.max) data.data.system.range.min = data.data.system.range.max;
    }

    addSpellRoll(data, damageType) {
        let rolls = data.data.system.roll;
        if (!Array.isArray(rolls)) {
            rolls =  Object.values(rolls);
        }
        let roll = {
            dice: 1,
            type: "d6",
            bonus: 0,
            damageType: damageType
        }
        rolls.push(roll);
        this.item.update({ "system.roll": rolls });
        this.render();
    }
}