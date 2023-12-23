import { gsap } from "/scripts/greensock/esm/all.js";

export default class firardFortressActorSheet extends ActorSheet {
    constructor(...args) {
        super(...args);

        this.hasBeenRendered = false;
        this.oldData = null;
    }

    get template() {
        console.log(`Firard Fortress | Loading ${this.actor.type} sheet`);

        return `systems/firardfortress/templates/sheets/actors/${this.actor.type}-sheets.hbs`;
    }

    static get defaultOptions() { 
        return mergeObject(super.defaultOptions, {
            width: 800,
            height: 880,
            classes: ["firardFortress", "sheet", "item"],
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}],
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }

    getData(verify) {
        const data = super.getData();
        for (let [key, value] of Object.entries(data.data.system.stat)) {
            value.mod.num = Math.floor((value.value - 10) / 2);
            if (value.mod.num >= 0) {
                value.mod.text = `+${value.mod.num}`;
            } else {
                value.mod.text = `${value.mod.num}`;
            }
        }
        this.verifyData(data, verify);
        this.initTinyMCE();
        this.dataHasBeenUpdated = JSON.stringify(data) !== JSON.stringify(this.oldData);
        console.log(data);
        return data;
    }

    async close(options = {}) {
        tinymce.remove();
        this.hasBeenRendered = false;
        this.dataHasBeenUpdated = false;
        this.oldData = null;
        return super.close(options);
    }

    activateListeners(html) {
        super.activateListeners(html);

        // click listeners
        html.find('.rollable').click(this._onRoll.bind(this));
        html.find('.add').click(this._onAdd.bind(this));
        html.find('.delete').click(this._onDelete.bind(this));
        html.find('.edit-item').click(this._onEditItem.bind(this));
        html.find('.item-checkbox').click(this._onEquipItem.bind(this));
        html.find('.move').click(this._onMove.bind(this));

        // hover listeners

        // input listeners
        html.find('.item-input').change(this._onUpdateItem.bind(this));

        // change listeners

        // submit listeners

        // other listeners
        if (!this.hasBeenRendered || this.dataHasBeenUpdated) {
            this.statBar();
            this.hasBeenRendered = true;
        }
    }

    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        switch (dataset.rolltype) {
            case "Stat":
                this.statRoll(event, dataset, "Main");
                break;
            case "Spell":
                this.itemRoll(event, dataset, "Spell");
                break;
            case "Skill":
                this.itemRoll(event, dataset, "Skill");
                break;
            case "Hybrid":
                this.itemRoll(event, dataset, "Hybrid");
                break;
            case "Proficiency":
                this.proficiencyRoll(event, dataset, "Proficiency");
                break;
            case "Weapon":
                this.itemRoll(event, dataset, "Weapon");
                break;
            default:
                break;
        }
    }

    async _onAdd(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        const data = this.getData(false);
        let updateData = {};

        switch (dataset.add) {
            case "Language":
                const newLanguage = {
                    name: "New Language",
                    type: "Language",
                    data: {
                        name: `${game.i18n.localize("FI.Description.NewLanguage")}`,
                        speaking: true,
                        reading: true,
                        writing: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newLanguage]);
                break;
            case "Spell":
                const newSpell = {
                    name: "New Spell",
                    type: "Spell",
                    data: {
                        name: `${game.i18n.localize("FI.Spell.NewSpell")}`,
                        spellType: "",
                        stat: "None",
                        mpCost: 0,
                        range: {
                            min: 0,
                            max: 0
                        },
                        roll: [
                            {
                                "dice": "1",
                                "bonus": 0,
                                "damageType": `${game.i18n.localize("FI.Spell.DefaultDamageType")}`
                            }
                        ],
                        description: "",
                        isSpell: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newSpell]);
                break;
            case "Skill":
                const newSkill = {
                    name: "New Skill",
                    type: "Skill",
                    data: {
                        name: `${game.i18n.localize("FI.Skill.NewSkill")}`,
                        skillType: "",
                        stat: "None",
                        spCost: 0,
                        range: {
                            min: 0,
                            max: 0
                        },
                        roll: [
                            {
                                "dice": "1",
                                "bonus": 0,
                                "damageType": `${game.i18n.localize("FI.Skill.DefaultDamageType")}`
                            }
                        ],
                        description: "",
                        isSKill: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newSkill]);
                break;
            case "Hybrid":
                const newHybrid = {
                    name: "New Hybrid",
                    type: "Hybrid",
                    data: {
                        name: `${game.i18n.localize("FI.Hybrid.NewHybrid")}`,
                        hybridType: "",
                        stat: "None",
                        mpCost: 0,
                        spCost: 0,
                        hpCost: 0,
                        otherCost: "",
                        range: {
                            min: 0,
                            max: 0
                        },
                        roll: [
                            {
                                "dice": "1",
                                "bonus": 0,
                                "damageType": `${game.i18n.localize("FI.Hybrid.DefaultDamageType")}`
                            }
                        ],
                        description: "",
                        isHybrid: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newHybrid]);
                break;
            case "Transformation":
                const newTransformation = {
                    name: "New Transformation",
                    type: "Transformation",
                    data: {
                        name: `${game.i18n.localize("FI.Transformation.NewTransformation")}`,
                        transformationType: "",
                        stat: "None",
                        mpCost: 0,
                        spCost: 0,
                        hpCost: 0,
                        otherCost: "",
                        description: "",
                        isTransformation: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newTransformation]);
                break;
            case "Passif":
                const newPassif = {
                    name: "New Passif",
                    type: "Passif",
                    data: {
                        name: `${game.i18n.localize("FI.Passif.NewPassif")}`,
                        passifType: "",
                        stat: "None",
                        description: "",
                        isPassif: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newPassif]);
                break;
            case "Proficiency":
                const newProficiency = {
                    name: "New Proficiency",
                    type: "Proficiency",
                    data: {
                        name: `${game.i18n.localize("FI.Proficiency.NewProficiency")}`,
                        proficiencyType: "",
                        stat: "None",
                        description: "",
                        isProficiency: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newProficiency]);
                break;
            case "Weapon":
                const newWeapon = {
                    name: "New Weapon",
                    type: "Weapon",
                    data: {
                        name: `${game.i18n.localize("FI.Weapon.NewWeapon")}`,
                        weaponType: "",
                        stat: "None",
                        ranged: false,
                        equipped: true,
                        stat: "None",
                        value: 0,
                        range: {
                            min: 0,
                            max: 0
                        },
                        roll: [
                            {
                                "dice": "1",
                                "bonus": 0,
                                "damageType": `${game.i18n.localize("FI.Weapon.DefaultDamageType")}`
                            }
                        ],
                        description: "",
                        quantity: 1,
                        weight: 0,
                        price: 0,
                        rarity: "",
                        isWeapon: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newWeapon]);
                break;
            case "Equipment":
                const newEquipment = {
                    name: "New Equipment",
                    type: "Equipment",
                    data: {
                        name: `${game.i18n.localize("FI.Equipment.NewEquipment")}`,
                        equipmentType: "",
                        stat: "None",
                        equipped: true,
                        PA: 0,
                        MA: 0,
                        value: 0,
                        description: "",
                        quantity: 1,
                        weight: 0,
                        price: 0,
                        rarity: "",
                        isEquipment: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newEquipment]);
                break;
            case "Misc":
                const newMisc = {
                    name: "New Misc",
                    type: "Misc",
                    data: {
                        name: `${game.i18n.localize("FI.Misc.NewMisc")}`,
                        miscType: "",
                        stat: "None",
                        value: 0,
                        description: "",
                        quantity: 1,
                        weight: 0,
                        price: 0,
                        rarity: "",
                        isMisc: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newMisc]);
                break;
            case "Money":
                const newMoney = {
                    name: "New Money",
                    type: "Money",
                    data: {
                        name: `${game.i18n.localize("FI.Money.NewMoney")}`,
                        value: 0,
                        description: "",
                        localisation: "",
                        quantity: 1,
                        value: 0,
                        isMoney: true
                    }
                }
                this.actor.createEmbeddedDocuments("Item", [newMoney]);
                break;
            default:
                console.log(`default: ${dataset.add}`);
                break;
        }
        this.object.update(updateData);
    }

    _onDelete(event) {
        event.preventDefault();
        const element = event.currentTarget;
        let dataset = element.dataset;
        const data = this.getData(true);
        let updateData = {};
        let index = 0;

        switch (dataset.delete) {
            case "Language":
                const language = this.actor.items.get(dataset.id);
                language.delete();
                break;
            case "Spell":
                const spell = this.actor.items.get(dataset.id);
                spell.delete();
                break;
            case "Skill":
                const skill = this.actor.items.get(dataset.id);
                skill.delete();
                break;
            case "Hybrid":
                const hybrid = this.actor.items.get(dataset.id);
                hybrid.delete();
                break;
            case "Transformation":
                const transformation = this.actor.items.get(dataset.id);
                transformation.delete();
                break;
            case "Passif":
                const passif = this.actor.items.get(dataset.id);
                passif.delete();
                break;
            case "Proficiency":
                const proficiency = this.actor.items.get(dataset.id);
                proficiency.delete();
                break;
            case "Weapon":
                const weapon = this.actor.items.get(dataset.id);
                weapon.delete();
                break;
            case "Equipment":
                const equipment = this.actor.items.get(dataset.id);
                equipment.delete();
                break;
            case "Misc":
                const misc = this.actor.items.get(dataset.id);
                misc.delete();
                break;
            case "Money":
                const money = this.actor.items.get(dataset.id);
                money.delete();
                break;
            default:
                console.log("default: " + dataset.delete);
                break;
        }
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
        console.log(itemId);
        const item = this.actor.items.get(itemId);
        const field = element.dataset.field;
        console.log(field);
        const value = element.value;
        console.log(value);

        return item.update({ [field]: value });
    }

    _onEquipItem(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const item = this.actor.items.get(element.dataset.id);
        const type = `system.${element.dataset.type}`
        console.log(item.system[element.dataset.type]);
        item.update({ [type]: !item.system[element.dataset.type] });
    }

    _onMove(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        if (dataset.type === "up") {
            this.moveItemUp(dataset, dataset.move);
        } else if (dataset.type === "down") {
            this.moveItemDown(dataset, dataset.move);
        }

    }


    allowDrop(ev) {	
        ev.preventDefault();
    }



    verifyData(data, verify) {
        this.verifyMP(data);
        this.verifySP(data);
        this.verifyPA(data);
        this.verifyMA(data);
        this.verifyHP(data);
        this.verifySpeedAndWeight(data);
        if (verify && this.actor.type !== "NPC") {
            this.verifyLanguages(data);
        }
    }
        



    // verify HP
    verifyHP(data) {
        const HPmax = data.data.system.HP.max;
        let HPvalue = data.data.system.HP.value;
        let HPtemp = data.data.system.HP.temp;

        if (HPvalue === null) {
            data.data.system.HP.value = 0;
            HPvalue = 0;
        }
        if (HPtemp === null) {
            data.data.system.HP.temp = 0;
            HPtemp = 0;
        }
        if (HPmax === null) {
            data.data.system.HP.max = 0;
        }

        if (HPvalue != HPmax && HPtemp > 0) {
            while (HPvalue < HPmax && HPtemp > 0) {
                data.data.system.HP.value = HPvalue + 1;
                data.data.system.HP.temp = HPtemp - 1;
                HPvalue = data.data.system.HP.value;
                HPtemp = data.data.system.HP.temp;
            }
        }
        if (HPvalue > HPmax) {
            data.data.system.HP.value = HPmax;
        } else if (HPvalue < -HPmax) {
            data.data.system.HP.value = -HPmax;
        }
        if (HPtemp < 0) {
            data.data.system.HP.temp = 0;
        }
    }

    // verify MP
    verifyMP(data) {
        const MPmax = data.data.system.MP.max;
        let MPvalue = data.data.system.MP.value;
        let MPtemp = data.data.system.MP.temp;
        let HPvalue = data.data.system.HP.value;

        if (MPvalue === null) {
            data.data.system.MP.value = 0;
            MPvalue = 0;
        }
        if (MPtemp === null) {
            data.data.system.MP.temp = 0;
            MPtemp = 0;
        }
        if (MPmax === null) {
            data.data.system.MP.max = 0;
        }

        if (MPvalue != MPmax && MPtemp > 0) {
            while (MPvalue < MPmax && MPtemp > 0) {
                data.data.system.MP.value = MPvalue + 1;
                data.data.system.MP.temp = MPtemp - 1;
                MPvalue = data.data.system.MP.value;
                MPtemp = data.data.system.MP.temp;
            }
        }
        if (MPvalue > MPmax) {
            data.data.system.MP.value = MPmax;
        } else if (MPvalue < 0) {
            data.data.system.MP.value = 0;
            data.data.system.HP.value = HPvalue + MPvalue;
        }
        if (MPtemp < 0) {
            data.data.system.MP.temp = 0;
        }
    }

    // verify SP
    verifySP(data) {
        const SPmax = data.data.system.SP.max;
        let SPvalue = data.data.system.SP.value;
        let SPtemp = data.data.system.SP.temp;
        let HPvalue = data.data.system.HP.value;

        if (SPvalue === null) {
            data.data.system.SP.value = 0;
            SPvalue = 0;
        }
        if (SPtemp === null) {
            data.data.system.SP.temp = 0;
            SPtemp = 0;
        }
        if (SPmax === null) {
            data.data.system.SP.max = 0;
        }

        if (SPvalue != SPmax && SPtemp > 0) {
            while (SPvalue < SPmax && SPtemp > 0) {
                data.data.system.SP.value = SPvalue + 1;
                data.data.system.SP.temp = SPtemp - 1;
                SPvalue = data.data.system.SP.value;
                SPtemp = data.data.system.SP.temp;
            }
        }
        if (SPvalue > SPmax) {
            data.data.system.SP.value = SPmax;
        } else if (SPvalue < 0) {
            data.data.system.SP.value = 0;
            data.data.system.HP.value = HPvalue + SPvalue;
        }
        if (SPtemp < 0) {
            data.data.system.SP.temp = 0;
        }
    }

    // verify PA
    verifyPA(data) {
        let PAmax = 0;
        let PAvalue = data.data.system.PA.value;
        let PAtemp = data.data.system.PA.temp;
        let items = data.items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type === "Equipment" && item.system.equipped) {
                PAmax += item.system.PA;
            }
        }
        data.data.system.PA.max = PAmax;

        if (PAvalue === null) {
            data.data.system.PA.value = 0;
            PAvalue = 0;
        }
        if (PAtemp === null) {
            data.data.system.PA.temp = 0;
            PAtemp = 0;
        }
        if (PAmax === null) {
            data.data.system.PA.max = 0;
        }

        if (PAvalue > PAmax) {
            data.data.system.PA.value = PAmax;
        } else if (PAvalue < 0) {
            data.data.system.PA.value = 0;
        }
        if (PAtemp < 0) {
            data.data.system.PA.temp = 0;
        }
    }

    // verify MA
    verifyMA(data) {
        let MAmax = 0;
        let MAvalue = data.data.system.MA.value;
        let MAtemp = data.data.system.MA.temp;
        let items = data.items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type === "Equipment" && item.system.equipped) {
                MAmax += item.system.MA;
            }
        }
        data.data.system.MA.max = MAmax;

        if (MAvalue === null) {
            data.data.system.MA.value = 0;
            MAvalue = 0;
        }
        if (MAtemp === null) {
            data.data.system.MA.temp = 0;
            MAtemp = 0;
        }
        if (MAmax === null) {
            data.data.system.MA.max = 0;
        }

        if (MAvalue > MAmax) {
            data.data.system.MA.value = MAmax;
        } else if (MAvalue < 0) {
            data.data.system.MA.value = 0;
        }
        if (MAtemp < 0) {
            data.data.system.MA.temp = 0;
        }
    }

    // verify Languages
    verifyLanguages(data) {
        const items = data.items;
        const languages = items.filter(item => item.type === "Language");

        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            if (language.system.speaking === null) {
                language.system.speaking = true;
            }
            if (language.system.reading === null) {
                language.system.reading = true;
            }
            if (language.system.writing === null) {
                language.system.writing = true;
            }
            language.name = `Language(${language.system.name})`;
        }

        this.actor.updateEmbeddedDocuments("Item", languages);
    }

    // verify speed and weight
    verifySpeedAndWeight(data) {
        const items = data.items;
        let weight = 0;
        let maxWeight = data.data.system.maxWeight;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type === "Equipment" || item.type === "Weapon" || item.type === "Misc") {
                weight += item.system.weight;
            }
        }

        if (maxWeight === null) {
            data.data.system.maxWeight = 0;
        }

        if (weight > maxWeight) {
            data.data.system.realSpeed = (data.data.system.baseSpeed - ((weight - maxWeight) / (10 + (data.data.system.stat.STR.mod.num) + (data.data.system.stat.CON.mod.num * 2)))).toFixed(2);
        } else {
            data.data.system.realSpeed = data.data.system.baseSpeed;
        }

        if (data.data.system.realSpeed < 0) {
            data.data.system.realSpeed = 0;
        }
        
        data.data.system.weight = weight;
    }

    // roll functions
    statRoll(event, dataset, rollType) {
        event.preventDefault();
        const data = this.getData(false);
        const advancedRoll = data.data.system.displayAdvancedRoll;
        let modif = this.calculateMod(dataset, data);
        let mod = modif.mod;
        let posture = modif.posture;        

        if (advancedRoll) {
            this.advRoll(dataset, rollType, mod, posture);
        } else {
            this.renderRollMessage(dataset, rollType, mod, posture);
        }
    }

    advRoll(dataset, rollType, mod, posture) {
        // new Dialog({title: "Title", content: html_content_to_display, buttons: {confirm:{icon: '<i class="fas fa-check"></i>', label: 'Confirm', callback: (html) => {//Code to do stuff here}}, cancel: {icon: '<i class="fas fa-times"></i>', label: "Cancel"}}}).render(true)
        new Dialog({
            title: `${game.i18n.localize("FI.System.AdvancedRolling")}: ${dataset.label}`,
            content: 
            `<div style="display:flex; flex-direction:column; height:50px">
                <select id="rollType">
                    <option value="normal">${game.i18n.localize("FI.System.Normal")}</option>
                    <option value="advantage">${game.i18n.localize("FI.System.Advantage")}</option>
                    <option value="disadvantage">${game.i18n.localize("FI.System.Disadvantage")}</option>
                    <option value="custom">${game.i18n.localize("FI.System.Custom")}</option>
                </select>
                <div id="rollCustomDiv" style="display:none">
                    <label for="rollCustom">${game.i18n.localize("FI.System.CustomRoll")}</label>
                    <input id="rollCustom" type="text" placeholder="${game.i18n.localize("FI.System.CustomRollPlaceholder")}">
                </div>
                <script>
                    document.getElementById("rollType").addEventListener("change", function() {
                        if (this.value == "custom") {
                            document.getElementById("rollCustomDiv").style.display = "flex";
                        } else {
                            document.getElementById("rollCustomDiv").style.display = "none";
                        }
                    });
                </script>
            </div>`,
            buttons: {
                confirm: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Confirm',
                    callback: (html) => {
                        if (rollType === "Main") {
                            this.renderAdvRollMessage(html, dataset, mod, posture);
                        } else if (rollType === "Item") {
                            this.statRollForItem(html, dataset, mod, posture);
                        }
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel"
                }
            },
            default: "confirm"
        }).render(true)
    }

    itemRoll(event, dataset) {
        event.preventDefault();
        this.statRoll(event, dataset, "Item");
    }

    proficiencyRoll(event, dataset) {
        event.preventDefault();
        let data = this.getData(false);
        let stat = dataset.type;
        let modif = this.calculateMod(dataset, data);
        let mod = modif.mod + `+${dataset.roll}`;
        let posture = modif.posture;
        let roll = new Roll("1d20" + mod);
        let label = dataset.label ? `${game.i18n.localize("FI.System.Rolling")} ${dataset.label}${posture}` : '';
        return roll.toMessage({
            speaker: ChatMessage.getSpeaker({
                actor: this.actor
            }),
            flavor: label
        });
    }

    statRollForItem(html, dataset, mod, posture) {
        const rollType = html.find('#rollType')[0].value;
        const rollCustom = html.find('#rollCustom')[0].value;
        let roll = new Roll("1d20" + mod);
        let label = dataset.label ? `${game.i18n.localize("FI.System.Rolling")} ${dataset.label}${posture}` : '';
        this.renderItemRollWindow(dataset, "Item");
        if (rollType == "normal") {
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        } else if (rollType == "advantage") {
            roll = new Roll("2d20kh" + mod);
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        } else if (rollType == "disadvantage") {
            roll = new Roll("2d20kl" + mod);
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        } else if (rollType == "custom") {
            roll = new Roll(rollCustom);
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        }
    }

    renderRollMessage(dataset, rollType, mod, posture) {
        let roll = new Roll("1d20" + mod);
        let label = dataset.label ? `${game.i18n.localize("FI.System.Rolling")} ${dataset.label}${posture}` : '';
        if (rollType == "Main") {
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        } else if (rollType == "Item") {
            this.renderItemRollWindow(dataset, "Item");
        }
    }

    renderAdvRollMessage(html, dataset, mod, posture) {
        const rollType = html.find('#rollType')[0].value;
        const rollCustom = html.find('#rollCustom')[0].value;
        let roll = new Roll("1d20" + mod);
        let label = dataset.label ? `${game.i18n.localize("FI.System.Rolling")} ${dataset.label}${posture}` : '';
        if (rollType == "normal") {
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        } else if (rollType == "advantage") {
            roll = new Roll("2d20kh" + mod);
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        } else if (rollType == "disadvantage") {
            roll = new Roll("2d20kl" + mod);
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        } else if (rollType == "custom") {
            roll = new Roll(rollCustom);
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        }
    }

    renderItemRollWindow(dataset, mod, posture) {
        const data = this.getData(false);
        const item = data.items.find(item => item._id === dataset.id);
        new Dialog({
            title: `${game.i18n.localize("FI.Roll.itemRoll")} ${item.name}`,
            content: 
            `<div style="display:flex; flex-direction:column; height:50px">
                <h2>${game.i18n.localize("FI.Roll.launchItemRoll")}</h2>
            </div>`,
            buttons: {
                confirm: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Confirm',
                    callback: (html) => {
                        this.renderItemRollMessage(item);
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel"
                }
            },
            default: "confirm"
        }).render(true)
    }

    renderItemRollMessage(item) {
        let type = item.type;
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

    // move item

    moveItemUp(dataset, type) {
        const data = this.getData(false);
        const items = data.items;
        const item = items.find(item => item._id === dataset.id);
        const itemsOfType = items.filter(item => item.type === type);
        const index = itemsOfType.findIndex(i => i._id === item._id);
        if (index > 0) {
            const temp = itemsOfType[index - 1];
            itemsOfType[index - 1] = item;
            itemsOfType[index] = temp;
        }
    
        const updates = itemsOfType.map((item, index) => ({
            _id: item._id,
            sort: index
        }));
    
        this.actor.updateEmbeddedDocuments("Item", updates);
    
        this.render();
    }

    moveItemDown(dataset, type) {
        const data = this.getData(false);
        const items = data.items;
        const item = items.find(item => item._id === dataset.id);
        const itemsOfType = items.filter(item => item.type === type);
        const index = itemsOfType.findIndex(i => i._id === item._id);
        if (index < itemsOfType.length - 1) {
            const temp = itemsOfType[index + 1];
            itemsOfType[index + 1] = item;
            itemsOfType[index] = temp;
        }
    
        const updates = itemsOfType.map((item, index) => ({
            _id: item._id,
            sort: index
        }));
    
        this.actor.updateEmbeddedDocuments("Item", updates);
    
        this.render();
    }

    // calculate mod

    calculateMod(dataset, data) {
        let mod = 0;
        let posture = "";
        if (typeof dataset.type === "string" && !(dataset.type == "None")) {
            mod = data.data.system.stat[dataset.type].mod.text;
        } else if (typeof dataset.type === "number") {
            if (dataset.type < 0) {
                mod = dataset.type;
            } else {
                mod = `+${dataset.type}`;
            }
        } else {
            mod = "";
        }
        if (data.data.system.posture === "Focus" && (dataset.type === "INT" || dataset.type === "WIS" || dataset.type === "CHA" || dataset.type === "WIL")) {
            mod += "+1";
            posture = " (+ Focus)"
        } else if (data.data.system.posture === "Focus" && (dataset.type === "DEX" || dataset.type === "CON" || dataset.type === "WIS" || dataset.type === "LUK")) {
            mod += "-1";
            posture = " (- Focus)"
        } else if (data.data.system.posture === "Concentration" && (dataset.type === "DEX" || dataset.type === "CON" || dataset.type === "STR" || dataset.type === "LUK")) {
            mod += "+1";
            posture = " (+ Concentration)"
        } else if (data.data.system.posture === "Concentration" && (dataset.type === "INT" || dataset.type === "WIS" || dataset.type === "CHA" || dataset.type === "WIL")) {
            mod += "-1";
            posture = " (- Concentration)"
        }
        return {mod: mod, posture: posture};
    }

    // init tinyMCE
    initTinyMCE() {
        tinymce.init({
            selector: '.richTextArea',
            menubar: false,
            toolbar: 'bold italic underline forecolor backcolor | fontfamily fontsize | alignleft aligncenter alignright alignjustify | bullist outdent indent | undo redo | removeformat',
            plugins: 'lists',
            min_height: 150,
            height: 150,
            setup: function (editor) {
                editor.on('change', function () {
                    editor.save();
                });
                editor.on('close', function () {
                    editor.save();
                });
            }
        });
    }

    // stat bar animations
    statBar() {
        const data = this.getData(false);
        const statList = ["HP", "MP", "SP", "PA", "MA"];
        const oldData = this.oldData;

        for (let i = 0; i < statList.length; i++) {
            const stat = statList[i];
            const statMax = data.data.system[stat].max;
            const statValue = data.data.system[stat].value;
            const statTemp = data.data.system[stat].temp;
            const statBarValue = document.querySelector(`.${stat}barValue`);
            const statBarTemp = document.querySelector(`.${stat}barTemp`);
            const statBarMax = document.querySelector(`.${stat}bar`);

            // set the bars value and temp to the size of the oldData to apply the animation after
            if (oldData !== null) {
                const oldStatMax = oldData.data.system[stat].max;
                const oldStatValue = oldData.data.system[stat].value;
                const oldStatTemp = oldData.data.system[stat].temp;

                if (oldStatValue >= 0) {
                    statBarValue.style.width = `${(oldStatValue / oldStatMax) * 100}%`;
                } else if (oldStatValue < 0) {
                    statBarValue.style.width = `${(oldStatValue / -oldStatMax) * 100}%`;
                }
                if (oldStatTemp < oldStatMax) {
                    statBarTemp.style.width = `${(oldStatTemp / oldStatMax) * 100}%`;
                } else if (oldStatTemp >= oldStatMax) {
                    statBarTemp.style.width = "100%";
                }
                if (oldStatMax === 0) {
                    statBarValue.style.width = "0%";
                    statBarTemp.style.width = "0%";
                    statBarMax.style.backgroundColor = "#808080";
                    statBarMax.style.opacity = "0.2";
                }
            }

            if (statValue >= 0) {
                gsap.to(statBarValue, {
                    delay : 0.1,
                    width: `${(statValue / statMax) * 100}%`,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            } else if (statValue < 0) {
                gsap.to(statBarValue, {
                    delay : 0.1,
                    width: `${(statValue / -statMax) * 100}%`,
                    duration: 0.5,
                    backgroundColor: "#000000",
                    ease: "power2.inOut"
                });
            }
            if (statTemp < statMax) {
                gsap.to(statBarTemp, {
                    delay : 0.1,
                    width: `${(statTemp / statMax) * 100}%`,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            } else if (statTemp >= statMax) {
                gsap.to(statBarTemp, {
                    delay : 0.1,
                    width: "100%",
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            }
            if (statMax === 0) {
                gsap.to(statBarValue, {
                    delay : 0.1,
                    width: "0%",
                    duration: 0.5,
                    ease: "power2.inOut"
                });
                gsap.to(statBarTemp, {
                    delay : 0.1,
                    width: "0%",
                    duration: 0.5,
                    ease: "power2.inOut"
                });
                gsap.to(statBarMax, {
                    delay : 0.1,
                    backgroundColor: "#808080",
                    opacity: 0.2,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            }
        }
        this.oldData = data;
    }
}