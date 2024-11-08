import { logToConsole } from "./helper.js";

function createAdventureDiceData(data) {
  data.segments = {};

  for (let i = 0; i <= data.total - 1; i++) {
    data.segments[i] = false;
  }

  for (let i = 0; i <= data.GMBalance - 1; i++) {
    data.segments[i] = true;
  }

  return data;
}

function createEquipmentData(data) {
  data.total = data.price * data.quantity;

  return data;
}

function createHybridData(data , actorData) {
  data = createItemFormulaData(data, actorData);

  return data;
}

function createLanguageData(data) {
  return data;
}

function createMiscData(data) {
  data.total = data.price * data.quantity;

  return data;
}

function createMoneyData(data) {
  data.total = data.value * data.quantity;

  return data;
}

function createPassifData(data) {
  return data;
}

function createProficiencyData(data, actorData) {
  data = createItemFormulaData(data, actorData);

  return data;
}

function createSkillData(data, actorData) {
  data =  createItemFormulaData(data, actorData);

  return data;
}

function createSpellData(data, actorData) {
  data = createItemFormulaData(data, actorData);

  return data;
}

function createTransformationData(data) {
  data = createItemFormulaData(data);
  
  return data;
}

function createWeaponData(data, actorData) {
 data = createItemFormulaData(data, actorData);

  return data;
}

function createItemFormulaData(data, actorData) {
  let rollDetails = {
    formula: "",
    stance: ""
  };

  if (actorData && data.stat !== "None" && data.stat) {
    let statMod = Math.floor((actorData.system.stat[data.stat].value - 10) / 2);
    let stanceMod = calculateStanceModifier(data.stat, actorData);

    rollDetails.formula += `${statMod >= 0 ? '+' : ''}${statMod}`;
    rollDetails.formula += stanceMod.mod;
    rollDetails.formula += `${data.value >= 0 ? '+' : ''}${data.value}`;

    rollDetails.stance = stanceMod.stance;
  } else {
    rollDetails.formula += `${data.value >= 0 ? '+' : ''}${data.value}`;
  }

  data.rollDetails = rollDetails;
  logToConsole("info", "Data Calculator", "Final details", data.rollDetails);
  return data;
}

function calculateStanceModifier(stat, actorData) {
  const stanceEffects = {
    "Aggressive": {
      "positive": ["STR", "DEX", "INT", "CHA"],
      "negative": ["CON", "WIS", "LUK", "WIL"],
      "modifier": {"positive": "+(1d6-3)", "negative": "-3"}
    },
    "Defensive": {
      "positive": ["CON", "WIS", "LUK", "WIL"],
      "negative": ["STR", "DEX", "INT", "CHA"],
      "modifier": {"positive": "+(1d6-3)", "negative": "-3"}
    },
    "Focus": {
      "positive": ["INT", "WIS", "CHA", "WIL"],
      "negative": ["STR", "DEX", "CON", "LUK"],
      "modifier": {"positive": "+1", "negative": "-1"}
    },
    "Concentration": {
      "positive": ["STR", "DEX", "CON", "LUK"],
      "negative": ["INT", "WIS", "CHA", "WIL"],
      "modifier": {"positive": "+1", "negative": "-1"}
    },
    "Elemental": {
      "universal": "+2"
    }
  };

  let mod = "";
  let stance = "";
  const currentStance = stanceEffects[actorData.system.stance];

  if (currentStance) {
    if (currentStance.universal) {
      mod = currentStance.universal;
      stance = ` (+ ${actorData.system.stance})`;
    } else {
      const effectType = currentStance.positive.includes(stat) ? "positive" : "negative";
      mod = currentStance.modifier[effectType];
      stance = ` (${mod.includes('+') ? '+' : '-'} ${actorData.system.stance})`;
    }
  }

  return { mod, stance };
}

export {
  createAdventureDiceData,
  createEquipmentData,
  createHybridData,
  createLanguageData,
  createMiscData,
  createMoneyData,
  createPassifData,
  createProficiencyData,
  createSkillData,
  createSpellData,
  createTransformationData,
  createWeaponData,
  calculateStanceModifier,
};
