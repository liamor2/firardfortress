function handleRoll(event) {
  event.preventDefault();
  const element = event.currentTarget;
  const dataset = element.dataset;
  console.log("Rolling", dataset);

  const rollFunctions = {
    attackRoll: handleAttackRoll,
    itemRoll: handleItemRoll,
  };

  const rollFunction = rollFunctions[dataset.type];
  if (rollFunction) {
    rollFunction(dataset);
  }
}

function handleAttackRoll(dataset) {
  console.log("Handling attack roll", dataset);
}

function handleItemRoll(dataset) {}

export { handleRoll };
