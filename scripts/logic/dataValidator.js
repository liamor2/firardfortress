function validateField(field, defaultValue) {
  if (typeof field === "object" && field !== null && !Array.isArray(field)) {
    Object.keys(field).forEach((key) => {
      field[key] = validateField(field[key], defaultValue[key]);
    });
    return field;
  } else {
    return field === null || field === undefined || field === ""
      ? defaultValue
      : field;
  }
}

function validateAdventureDiceData(data) {
  const defaultValues = {
    group: "",
    heroBalance: 2,
    GMBalance: 1,
    total: 3,
  };

  var systemData = data.data.system;

  if (!systemData.group) {
    systemData.group = defaultValues.group;
  }

  if (
    systemData.heroBalance < 0 ||
    systemData.heroBalance == null ||
    systemData.heroBalance === ""
  ) {
    systemData.heroBalance = defaultValues.heroBalance;
  }

  if (
    systemData.GMBalance < 0 ||
    systemData.GMBalance == null ||
    systemData.GMBalance === ""
  ) {
    systemData.GMBalance = defaultValues.GMBalance;
  }

  if (systemData.total !== systemData.heroBalance + systemData.GMBalance) {
    systemData.total = systemData.heroBalance + systemData.GMBalance;
  }

  if (systemData.heroBalance + systemData.GMBalance < 1) {
    systemData.heroBalance = defaultValues.heroBalance;
    systemData.GMBalance = defaultValues.GMBalance;
    systemData.total = systemData.heroBalance + systemData.GMBalance;
  }

  return data;
}

function validateEquipmentData(data) {
  const defaultData = {
    name: "",
    description: "",
    weight: 1,
    price: 1,
    quantity: 1,
    rarity: "Common",
    equipped: false,
    PA: 0,
    MA: 0,
    equipmentType: "",
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

function validateHybridData(data) {
  const defaultData = {
    name: "",
    description: "",
    stat: "None",
    value: 0,
    hybridType: "",
    mpCost: 0,
    spCost: 0,
    hpCost: 0,
    otherCost: "",
    range: {
      min: 0,
      max: 1,
    },
    roll: {
      0: {
        dice: 1,
        type: "d6",
        bonus: 0,
        damageType: "",
      },
    },
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

function validateMiscData(data) {
  const defaultData = {
    name: "",
    description: "",
    weight: 0,
    price: 0,
    quantity: 1,
    rarity: "Common",
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

function validateMoneyData(data) {
  const defaultData = {
    name: "",
    description: "",
    localisation: "",
    value: 0,
    quantity: 1,
    total: 0,
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

function validatePassifData(data) {
  const defaultData = {
    name: "",
    description: "",
    passifType: "",
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

function validateProficiencyData(data) {
  const defaultData = {
    name: "",
    description: "",
    stat: "None",
    value: 0,
    proficiencyType: "",
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

function validateSkillData(data) {
  const defaultData = {
    name: "",
    description: "",
    stat: "None",
    value: 0,
    skillType: "",
    spCost: 1,
    range: {
      min: 0,
      max: 1,
    },
    roll: [
      {
        dice: 1,
        type: "d6",
        bonus: 0,
        damageType: "",
      },
    ],
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

function validateSpellData(data) {
  const defaultData = {
    name: "",
    description: "",
    stat: "None",
    value: 0,
    spellType: "",
    mpCost: 1,
    range: {
      min: 0,
      max: 1,
    },
    roll: {
      0: {
        dice: 1,
        type: "d6",
        bonus: 0,
        damageType: "",
      },
    },
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

function validateTransformationData(data) {
  const defaultData = {
    name: "",
    description: "",
    stat: "None",
    transformationType: "",
    mpCost: 0,
    spCost: 0,
    hpCost: 0,
    otherCost: "",
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

function validateWeaponData(data) {
  const defaultData = {
    name: "",
    description: "",
    weight: 0,
    price: 0,
    quantity: 1,
    rarity: "Common",
    equipped: false,
    stat: "None",
    value: 0,
    weaponType: "",
    ranged: false,
    roll: {
      0: {
        dice: 1,
        type: "d6",
        bonus: 0,
        damageType: "",
      },
    },
    range: {
      min: 0,
      max: 0,
    },
  };

  var systemData = data.data.system;

  return validateField(systemData, defaultData);
}

export {
  validateAdventureDiceData,
  validateEquipmentData,
  validateHybridData,
  validateMiscData,
  validateMoneyData,
  validatePassifData,
  validateProficiencyData,
  validateSkillData,
  validateSpellData,
  validateTransformationData,
  validateWeaponData,
};
