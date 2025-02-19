import { logToConsole } from "../logic.old/helper.js";

export default class firardFortressActor extends Actor {
  constructor(...args) {
    super(...args);
  }

  prepareData() {
    super.prepareData();

    const actorData = this;

    this._prepareCharacterData(actorData);

    const isNPC = actorData.type === "NPC";
    const statBlocks = isNPC
      ? [
          ["STR", "DEX", "CON"],
          ["INT", "WIS", "WIL"],
          ["CHA", "LUK", "HON"],
        ]
      : [
          ["STR", "DEX", "CON", "INT", "WIS"],
          ["WIL", "CHA", "LUK", "HON"],
        ];

    const dataForTemplate = statBlocks.map((block) => {
      return block.map((statKey) => ({
        statKey: statKey,
        tableColspan: isNPC ? 1 : block === statBlocks[0] ? 4 : 5,
        modText: actorData.system.stat[statKey].mod.text,
        modNum: actorData.system.stat[statKey].mod.num,
      }));
    });

    actorData.statBlocks = dataForTemplate;

    logToConsole("debug", "Actor", "Data prepared", actorData);
  }

  _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);

    if (userId === game.userId) {
      if (data.system && data.system.stance) {
        this._updateCharacterDataStances(data.system);
      }
    }
  }

  _prepareCharacterData(actorData) {
    const systemData = actorData.system;

    this._prepareCharacterStats(systemData);
    if (actorData.type === "NPC") return;
    this._prepareCharacterSubStats(systemData);
    this._prepareCharacterWeightAndSpeed(systemData);
    this._prepareCharacterInitiative(systemData);
    this._prepareCharacterDataLanguages(systemData);
    this._prepareCharacterDataAlignment(systemData);
  }

  _prepareCharacterStats(systemData) {
    const stats = systemData.stat;
    const statsArray = Object.values(stats);

    statsArray.forEach((stat) => {
      stat.mod = {
        num: Math.floor((stat.value - 10) / 2),
        text:
          (Math.floor((stat.value - 10) / 2) >= 0 ? "+" : "") + Math.floor((stat.value - 10) / 2),
      };
    });
  }

  _prepareCharacterSubStats(systemData) {
    const subStats = ["HealthPoints", "ManaPoints", "StaminaPoints", "PhysicalArmor", "MagicalArmor"];
    const items = this.items;
    subStats.forEach((index) => {
      const subStat = systemData[index];

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

      if (value != max && temp > 0 && (index == "HealthPoints" || index == "ManaPoints" || index == "StaminaPoints")) {
        while (value < max && temp > 0) {
          value = value + 1;
          temp = temp - 1;
        }
      } else if (index == "PhysicalArmor" || index == "MagicalArmor") {
        max = 0;

        items.forEach((item) => {
          if (item.type == "Equipment" && item.system.equipped) {
            max += item.system[index];
          }
        });
      }

      if (value > max) {
        value = max;
      } else if (value < -max && index == "HealthPoints") {
        value = -max;
      } else if (value < 0 && index == ("ManaPoints" || "StaminaPoints")) {
        systemData.HealthPoints.value += value;
        value = 0;
      } else if (value < 0 && index == ("PhysicalArmor" || "MagicalArmor")) {
        value = 0;
      }
      if (temp < 0) {
        temp = 0;
      }

      subStat.max = max;
      subStat.min = index == "HealthPoints" ? -max : 0;
      subStat.value = value;
      subStat.temp = temp;
      subStat.total = subStat.value + subStat.temp;
    });
  }

  _prepareCharacterWeightAndSpeed(systemData) {
    const items = this.items;
    let weight = 0;
    let maxWeight = systemData.weight.max;
    let totalMoney = 0;
    let totalWorth = 0;
    let realSpeed = systemData.speed.base;
    let baseSpeed = systemData.speed.base;

    items.forEach((item) => {
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
      systemData.weight = {
        value: weight,
        max: maxWeight,
        over: true,
        encumbrance: ((weight / maxWeight) * 100).toFixed(2),
      };
      realSpeed = (
        baseSpeed -
        (weight - maxWeight) / (10 + systemData.stat.STR.mod.num + systemData.stat.CON.mod.num * 2)
      ).toFixed(2);
    } else {
      systemData.weight = {
        value: weight,
        max: maxWeight,
        over: false,
        encumbrance: ((weight / maxWeight) * 100).toFixed(2),
      };
      realSpeed = baseSpeed;
    }

    if (realSpeed < 0) {
      realSpeed = 0;
    }

    systemData.speed = {
      value: realSpeed,
      base: baseSpeed,
    };

    systemData.money = {
      value: totalMoney,
      worth: totalWorth,
    };
  }

  _prepareCharacterInitiative(systemData) {
    let value =
      systemData.stat.DEX.mod.num +
      systemData.stat.INT.value / 100 +
      systemData.stat.LUK.mod.num / 2 +
      systemData.speed.value / 10;
    let formula = "1d20 + " + value.toFixed(2);

    if (systemData.weight.over) {
      formula = "2d20kl + " + value.toFixed(2);
    }

    systemData.initiative = {
      value: value.toFixed(2),
      formula: formula,
      decimals: 2,
    };
  }

  _prepareCharacterDataLanguages(systemData) {
    const items = this.items;
    let languages = [];

    items.forEach((item) => {
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

  _prepareCharacterDataAlignment(systemData) {
    const alignment = systemData.alignment;
    const middle = 72.5;

    if (!(typeof alignment === "object")) {
      systemData.alignment = { x: middle, y: middle };
    }
    if (alignment.x === null) {
      systemData.alignment.x = middle;
    }
    if (alignment.y === null) {
      systemData.alignment.y = middle;
    }
  }

  _updateCharacterDataStances(systemData) {
    var stances = this.effects.filter((effect) => effect.flags.group === "stance");
    const dataStance = systemData.stance;

    if (stances.length === 1 && stances[0].flags.stanceId === dataStance) {
      return;
    } else if (stances.length > 1) {
      stances.forEach((stance) => {
        if (stance.flags.stanceId !== dataStance) {
          this.toggleStatusEffect(stance.flags.stanceId, { active: false });
        }
      });
    } else if (stances.length === 1) {
      const stance = stances[0];
      if (stance.flags.stanceId !== dataStance) {
        this.toggleStatusEffect(stance.flags.stanceId, { active: false });
        this.toggleStatusEffect(dataStance, { active: true });
      }
    } else {
      this.toggleStatusEffect(dataStance, { active: true });
    }
  }
}
