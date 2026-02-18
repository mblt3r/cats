// Топ «самых смешных» котиков из бесконечной ленты.
// Хранилище в памяти: при перезапуске сервера очищается.

const topCats = [];
let nextId = 1;

function getTopCats() {
  // сортируем по количеству голосов по убыванию
  return topCats
    .slice()
    .sort((a, b) => b.votes - a.votes)
    .map((c) => ({ ...c }));
}

function addFunnyVote(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    throw new Error("INVALID_IMAGE_PATH");
  }

  let item = topCats.find((c) => c.imagePath === imagePath);
  if (!item) {
    item = {
      id: nextId++,
      imagePath,
      votes: 0,
    };
    topCats.push(item);
  }

  item.votes += 1;
  return getTopCats();
}

function incrementVote(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    throw new Error("INVALID_IMAGE_PATH");
  }

  let item = topCats.find((c) => c.imagePath === imagePath);
  if (!item) {
    throw new Error("CAT_NOT_FOUND");
  }

  item.votes += 1;
  return getTopCats();
}

function decrementVote(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    throw new Error("INVALID_IMAGE_PATH");
  }

  let item = topCats.find((c) => c.imagePath === imagePath);
  if (!item) {
    throw new Error("CAT_NOT_FOUND");
  }

  item.votes = Math.max(0, item.votes - 1);

  // Если голосов стало 0, удаляем котика из топа
  if (item.votes === 0) {
    const index = topCats.findIndex((c) => c.imagePath === imagePath);
    if (index > -1) {
      topCats.splice(index, 1);
    }
  }

  return getTopCats();
}

function getRemovedCats() {
  // Возвращаем котиков, которые были удалены из топа (можно использовать для логики)
  return [];
}

module.exports = {
  getTopCats,
  addFunnyVote,
  incrementVote,
  decrementVote,
};
