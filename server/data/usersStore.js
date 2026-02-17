const bcrypt = require("bcrypt");

// Простое in-memory хранилище пользователей.
// В реальном проекте это должна быть БД.
const users = [];
let nextId = 1;

async function createUser(username, password) {
  const existing = users.find((u) => u.username === username);
  if (existing) {
    throw new Error("USER_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nextId++,
    username,
    passwordHash
  };
  users.push(user);
  return { id: user.id, username: user.username };
}

function findUserByName(username) {
  return users.find((u) => u.username === username) || null;
}

async function verifyUser(username, password) {
  const user = findUserByName(username);
  if (!user) {
    return null;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return null;
  }
  return { id: user.id, username: user.username };
}

module.exports = {
  createUser,
  findUserByName,
  verifyUser
};

