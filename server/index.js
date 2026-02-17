const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const authRoutes = require("./authRoutes");
const catsRoutes = require("./catsRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "change_this_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  }),
);

// Маршруты авторизации
app.use("/auth", authRoutes);

// Маршруты котиков (под префиксом /api)
app.use("/api", catsRoutes);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
