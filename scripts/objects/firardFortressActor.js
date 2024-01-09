export default  class firardFortressActor extends Actor {

    prepareData() {
        super.prepareData();

        const actorData = this;
        console.log(actorData);
        
        this._prepareCharacterData(actorData);
    }

    _prepareCharacterData(actorData) {
        const data = actorData.system;

        this._prepareCharacterStats(data);
        if (actorData.type === "NPC") return;
        this._prepareCharacterSubStats(data);
        this._prepareCharacterWeightAndSpeed(data);
        this._prepareCharacterInitiative(data);
        this._prepareCharacterDataLanguages(data);
        this._prepareCharacterDataAlignment(data);
    }

    _prepareCharacterStats(data) {
        const stats = data.stat;
        const statsArray = Object.values(stats);

        statsArray.forEach(stat => {
            stat.mod = {
                num: Math.floor((stat.value - 10) / 2),
                text: (Math.floor((stat.value - 10) / 2) >= 0 ? "+" : "") + Math.floor((stat.value - 10) / 2)
            }
        });
    }

    _prepareCharacterSubStats(data) {
        const subStats = ["HP", "MP", "SP", "PA", "MA"]
        const items = this.items;
        subStats.forEach(index => {
            const subStat = data[index];

            var max = subStat.max;
            var min = subStat.min;
            var value = subStat.value;
            var temp = subStat.temp;

            if (value == null) {
                value = 0;
            }
            if (max == null) {
                max = 10;
            }
            if (min == null) {
                min = 0;
            }
            if (temp == null) {
                temp = 0;
            }

            if ((value != max && temp > 0) && (index == "HP" || index == "MP" || index == "SP")) {
                while (value < max && temp > 0) {
                    value = value + 1;
                    temp = temp - 1;
                }
            } else if (index == "PA" || index == "MA") {
                max = 0;

                items.forEach(item => {
                    if (item.type == "Equipment" && item.system.equipped) {
                        max += item.system[index];
                    }
                });
            }

            if (value > max) {
                value = max;
            } else if (value < -max && index == "HP") {
                value = -max;
            } else if (value < 0 && index == ("MP" || "SP")) {
                data.HP.value += value;
                value = 0;
            } else if (value < 0 && index == ("PA" || "MA")) {
                value = 0;
            }
            if (temp < 0) {
                temp = 0;
            }

            subStat.max = max;
            subStat.min = (index == "HP" ? -max : 0);
            subStat.value = value;
            subStat.temp = temp;
            subStat.total = subStat.value + subStat.temp;
        });
    }

    _prepareCharacterWeightAndSpeed(data) {
        const items = this.items;
        let weight = 0;
        let maxWeight = data.weight.max;
        let totalMoney = 0;
        let totalWorth = 0;
        let realSpeed = data.speed.base;
        let baseSpeed = data.speed.base;

        items.forEach(item => {
            if (item.type === "Equipment" || item.type === "Weapon" || item.type === "Misc") {
                weight += item.system.weight * item.system.quantity;
                totalWorth += parseFloat(item.system.price) * parseFloat(item.system.quantity);
            }
            if (item.type === "Money") {
                totalMoney += parseFloat(item.system.value) * parseFloat(item.system.quantity);
            }
        });

        if (maxWeight == null) {
            maxWeight = 10;
        }

        if (weight > maxWeight) {
            data.weight = {
                value: weight,
                max: maxWeight,
                over: true,
                encumbrance: (weight / maxWeight * 100).toFixed(2)
            };
            realSpeed = (baseSpeed - ((weight - maxWeight) / (10 + (data.stat.STR.mod.num) + (data.stat.CON.mod.num * 2)))).toFixed(2);
        } else {
            data.weight = {
                value: weight,
                max: maxWeight,
                over: false,
                encumbrance: (weight / maxWeight * 100).toFixed(2)
            };
            realSpeed = baseSpeed;
        }

        if (realSpeed < 0) {
            realSpeed = 0;
        }

        data.speed = {
            value: realSpeed,
            base: baseSpeed
        };

        data.money = {
            value: totalMoney,
            worth: totalWorth
        };
    }

    _prepareCharacterInitiative(data) {
        let value = data.stat.DEX.mod.num + (data.stat.INT.value / 100) + (data.stat.LUK.mod.num / 2) + (data.speed.value / 10);
        let formula = "1d20 + " + value.toFixed(2);
        
        if (data.weight.over) {
            formula = "2d20kl + " + value.toFixed(2);
        }
        
        data.initiative = {
            value: value.toFixed(2),
            formula: formula,
            decimals: 2
        };
    }

    _prepareCharacterDataLanguages(data) {
        const items = this.items;
        let languages = [];

        items.forEach(item => {
            if (item.type === "Language") {
                languages.push(item);
            }
        });

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

        this.updateEmbeddedDocuments("Item", languages);
    }

    _prepareCharacterDataAlignment(data) {
        const alignment = data.alignment;
        const middle = 72.5;

        if (!(typeof alignment === "object")) {
            data.alignment = {x: middle, y: middle};
        }
        if (alignment.x === null) {
            data.alignment.x = middle;
        }
        if (alignment.y === null) {
            data.alignment.y = middle;
        }
    }
}