function validateField(field, defaultValue) {
  if (typeof field === "object" && field !== null && !Array.isArray(field)) {
    if (field instanceof Object && !(field instanceof Array)) {
      const result = {};
      const keys = Object.keys(defaultValue);
      keys.forEach((key) => {
        result[key] = validateField(field[key], defaultValue[key]);
      });
      return result;
    }
  } else {
    return field === null || field === undefined || field === ""
      ? (typeof defaultValue === 'object' ? JSON.parse(JSON.stringify(defaultValue)) : defaultValue)
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

  if (!data.group) {
    data.group = defaultValues.group;
  }

  if (
    data.heroBalance < 0 ||
    data.heroBalance == null ||
    data.heroBalance === ""
  ) {
    data.heroBalance = defaultValues.heroBalance;
  }

  if (
    data.GMBalance < 0 ||
    data.GMBalance == null ||
    data.GMBalance === ""
  ) {
    data.GMBalance = defaultValues.GMBalance;
  }

  if (data.total !== data.heroBalance + data.GMBalance) {
    data.total = data.heroBalance + data.GMBalance;
  }

  if (data.heroBalance + data.GMBalance < 1) {
    data.heroBalance = defaultValues.heroBalance;
    data.GMBalance = defaultValues.GMBalance;
    data.total = data.heroBalance + data.GMBalance;
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

  return validateField(data, defaultData);
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

  return validateField(data, defaultData);
}

function validateLanguageData(data) {
  const defaultData = {
    name: "",
    isLanguage: true,
    speaking: false,
    reading: false,
    writing: false
  };

  return validateField(data, defaultData);
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


  return validateField(data, defaultData);
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


  return validateField(data, defaultData);
}

function validatePassifData(data) {
  const defaultData = {
    name: "",
    description: "",
    passifType: "",
  };


  return validateField(data, defaultData);
}

function validateProficiencyData(data) {
  const defaultData = {
    name: "",
    description: "",
    stat: "None",
    value: 0,
    proficiencyType: "",
  };


  return validateField(data, defaultData);
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
    roll: {
      0: {
        dice: 1,
        type: "d6",
        bonus: 0,
        damageType: "",
      },
    }
  };


  return validateField(data, defaultData);
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


  return validateField(data, defaultData);
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


  return validateField(data, defaultData);
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


  return validateField(data, defaultData);
}

export {
  validateAdventureDiceData,
  validateEquipmentData,
  validateHybridData,
  validateLanguageData,
  validateMiscData,
  validateMoneyData,
  validatePassifData,
  validateProficiencyData,
  validateSkillData,
  validateSpellData,
  validateTransformationData,
  validateWeaponData,
};
