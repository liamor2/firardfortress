function getItemData(dataset) {
  let data = {
    actor: {},
    item: {},
  };
  if (dataset.actor) {
    data.actor = game.actors.get(dataset.actor);
    data.item = data.actor.items.get(dataset.id);
  } else {
    data.item = game.items.get(dataset.id);
  }

  return data;
}

function getItemCardData(dataset) {
  let data = {
    actor: {},
    item: {},
  };

  data.actor = game.actors.get(dataset.actor);
  console.log(data.actor);
  data.item = data.actor.items.get(dataset.id);
  console.log(data.item);

  return data;
}

function handleAdd(event) {
  event.preventDefault();
  const element = event.currentTarget;
  const dataset = element.dataset;
  console.log("Adding", dataset);

  const data = getItemData(dataset);
  const { item, actor } = data;

  const addFunctions = {
    addRoll: handleAddRoll,
  };

  const addFunction = addFunctions[dataset.type];
  if (addFunction) {
    addFunction(item, actor);
  }
}

function handleAddRoll(item, actor) {
  const roll = {
    dice: 1,
    type: "d6",
    bonus: 0,
    damageType: "Physical",
  };

  const rolls = item.system.roll || {};
  const newKey = Object.keys(rolls).length;
  const newRolls = { ...rolls, [newKey]: roll };

  item.update({
    "system.roll": newRolls,
  });
}

function handleDelete(event) {
  event.preventDefault();
  const element = event.currentTarget;
  const dataset = element.dataset;
  console.log("Deleting", dataset);

  const data = getItemData(dataset);
  const { item, actor } = data;

  console.log(item, actor);

  const deleteFunctions = {
    deleteRoll: handleDeleteRoll,
  };

  const deleteFunction = deleteFunctions[dataset.type];
  if (deleteFunction) {
    deleteFunction(item, actor, dataset.index);
  }
}

function handleDeleteRoll(item, actor, index) {
  let rolls = item.system.roll;
  if (!Array.isArray(rolls)) {
    rolls = Object.values(rolls);
  }
  rolls.splice(index, 1);
  item.update({
    "system.roll": rolls,
  });
}

function handleAdventureBalance(item, isGM) {
  console.log("Balancing", item, isGM);
  const balances = [ "heroBalance", "GMBalance" ];
  const balance = isGM ? balances[1] : balances[0];
  const otherBalance = isGM ? balances[0] : balances[1];
  item.system[balance]++;
  item.system[otherBalance]--;

  if (item.system[balance] > (item.system[balance] + item.system[otherBalance]) || (item.system[balance] === 0 && item.system[otherBalance] === 0)) {
    return false;
  }

  item.update({
    "system": item.system,
  });

  return true;
}

function validateCardRollOrigin (data) {
  console.log("Validating card roll origin", data);
  if (data.item.isOwner) {
    return true;
  } else {
    ui.notifications.warn(`${game.i18n.localize("FI.System.NotOwnerWarning")}`);
  }

  return false;
}

export {
  getItemData,
  getItemCardData,
  handleAdventureBalance,
  handleAdd,
  handleDelete,
  validateCardRollOrigin,};