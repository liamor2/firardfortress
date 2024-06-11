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

function createMoneyData(data) {
  data.total = data.value * data.quantity;

  return data;
}

export { createAdventureDiceData, createMoneyData };
