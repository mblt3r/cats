const express = require("express");
const { createUser, verifyUser } = require("./data/usersStore");

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("Register request:", req);
  const { username, password } = req.body || {};

  if (!username || !password || password.length < 4) {
    return res
      .status(400)
      .json({ error: "Укажите логин и пароль (минимум 4 символа)." });
  }

  try {
    const user = await createUser(username, password);
    req.session.userId = user.id;
    req.session.username = user.username;
    return res.json({ username: user.username });
  } catch (e) {
    if (e && e.message === "USER_EXISTS") {
      return res.status(409).json({ error: "Такой логин уже занят." });
    }
    console.error(e);
    return res.status(500).json({ error: "Ошибка при регистрации." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Укажите логин и пароль." });
  }

  try {
    const user = await verifyUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Неверный логин или пароль." });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    return res.json({ username: user.username });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Ошибка при входе." });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

module.exports = router;
