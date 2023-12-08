import { gsap } from "/scripts/greensock/esm/all.js";

export default class firardFortressActorSheet extends ActorSheet {
    get template() {
        console.log(`firardFortress | Loading ${this.actor.type} sheet`);

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
        console.log(data);
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.rollable').click(this._onRoll.bind(this));
        html.find('.add').click(this._onAdd.bind(this));
        html.find('.delete').click(this._onDelete.bind(this));

        this.statBar();
    }

    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        const data = this.getData(true);
        const advancedRoll = data.data.system.displayAdvancedRoll;
        let mod = 0;
        if (dataset.roll < 0) {
            mod = dataset.roll;
        } else {
            mod = `+${dataset.roll}`;
        }

        if (advancedRoll) {
            new Dialog({
                title: `Advanced Roll: ${dataset.label}`,
                content: 
                `<div style="display:flex; flex-direction:column; height:50px">
                    <select id="rollType">
                        <option value="normal">Normal</option>
                        <option value="advantage">Advantage</option>
                        <option value="disadvantage">Disadvantage</option>
                        <option value="custom">Custom</option>
                    </select>
                    <div id="rollCustomDiv" style="display:none">
                        <label for="rollCustom">Formula</label>
                        <input id="rollCustom" type="text" placeholder="Custom Roll">
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
                            const rollType = html.find('#rollType')[0].value;
                            const rollCustom = html.find('#rollCustom')[0].value;
                            let roll = new Roll("1d20" + mod);
                            let label = dataset.label ? `Rolling ${dataset.label}` : '';
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
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancel"
                    }
                },
                default: "confirm"
            }).render(true)
        } else {
            let roll = new Roll("1d20" + mod);
            let label = dataset.label ? `Rolling ${dataset.label}` : '';
            return roll.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: this.actor
                }),
                flavor: label
            });
        }
    }

    _onAdvRoll(event) {
        // new Dialog({title: "Title", content: html_content_to_display, buttons: {confirm:{icon: '<i class="fas fa-check"></i>', label: 'Confirm', callback: (html) => {//Code to do stuff here}}, cancel: {icon: '<i class="fas fa-times"></i>', label: "Cancel"}}}).render(true)
    }

    async _onAdd(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        const data = this.getData(true);
        let updateData = {};
        // console.log(dataset.add);

        switch (dataset.add) {
            case "system.languages":
                let languages = data.data.system.languages;
                if (!Array.isArray(languages)) {
                    languages = Object.values(languages);
                }
                const newLanguage = {
                    "name": "",
                    "speaking": true,
                    "reading": true,
                    "writing": true
                }
                languages.push(newLanguage);
                updateData = {"system.languages": languages};
            default:
                // console.log(dataset.add)
                break;
        }
        // console.log(this.object);
        this.object.update(updateData);
    }

    _onDelete(event) {
        event.preventDefault();
        const element = event.currentTarget;
        let dataset = element.dataset;
        const data = this.getData(true);
        let updateData = {};
        let index = 0;
        if (dataset.delete.includes("system.languages")) {
            index = parseInt(dataset.delete.slice(17));
            dataset.delete = "system.languages";
        }

        switch (dataset.delete) {
            case "system.languages":
                let languages = data.data.system.languages;
                if (!Array.isArray(languages)) {
                    languages = Object.values(languages);
                }
                languages.splice(index, 1);
                updateData = { "system.languages": languages };
                break;
            default:
                console.log("default: " + dataset.delete);
                break;
        }
        this.object.update(updateData);
    }



    verifyData(data, verify) {
        this.verifyMP(data);
        this.verifySP(data);
        this.verifyPA(data);
        this.verifyMA(data);
        this.verifyHP(data);
        if (verify) {
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
        const PAmax = data.data.system.PA.max;
        let PAvalue = data.data.system.PA.value;
        let PAtemp = data.data.system.PA.temp;

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

        // if (PAvalue != PAmax && PAtemp > 0) {
        //     while (PAvalue < PAmax && PAtemp > 0) {
        //         data.data.system.PA.value = PAvalue + 1;
        //         data.data.system.PA.temp = PAtemp - 1;
        //         PAvalue = data.data.system.PA.value;
        //         PAtemp = data.data.system.PA.temp;
        //     }
        // }
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
        const MAmax = data.data.system.MA.max;
        let MAvalue = data.data.system.MA.value;
        let MAtemp = data.data.system.MA.temp;

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

        // if (MAvalue != MAmax && MAtemp > 0) {
        //     while (MAvalue < MAmax && MAtemp > 0) {
        //         data.data.system.MA.value = MAvalue + 1;
        //         data.data.system.MA.temp = MAtemp - 1;
        //         MAvalue = data.data.system.MA.value;
        //         MAtemp = data.data.system.MA.temp;
        //     }
        // }
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
        const systemLanguages = Array.isArray(data.data.system.languages) ? data.data.system.languages : Object.values(data.data.system.languages);
        const languageItems = this.actor.items.filter(item => item.type === "Language");

        if (systemLanguages.length === 0) {
            systemLanguages.push({
                "name": "Common",
                "speaking": true,
                "reading": true,
                "writing": true
            });
        }

        for (const language of systemLanguages) {
            if (language.name === "") {
                continue;
            }

            const associatedItem = languageItems.find(item => item.name === language.name);
            if (!associatedItem) {
                console.log("Firard Fortress | Creating new language item");
                const newLanguageItem = [{
                    name: language.name,
                    type: "Language",
                    data: {
                        speaking: language.speaking,
                        reading: language.reading,
                        writing: language.writing
                    }
                }];
                if (languageItems.find(item => item.name === language.name)) {
                    console.log("Firard Fortress | Language item already exists");
                    continue;
                } else {
                    this.actor.createEmbeddedDocuments("Item", newLanguageItem);
                }
            }
        }
    }


    // stat bar animations
    statBar() {
        const data = this.getData(false);
        const statList = ["HP", "MP", "SP", "PA", "MA"];

        for (let i = 0; i < statList.length; i++) {
            const stat = statList[i];
            const statMax = data.data.system[stat].max;
            const statValue = data.data.system[stat].value;
            const statTemp = data.data.system[stat].temp;
            const statBarValue = document.querySelector(`.${stat}barValue`);
            const statBarTemp = document.querySelector(`.${stat}barTemp`);

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
        }
    }
}