const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./authRoutes");
const catsRoutes = require("./catsRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Включаем CORS для запросов с фронтенда
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  }),
);

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

// В development режиме отдаем статику и обрабатываем SPA маршруты
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Для всех остальных запросов отдаем index.html (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });
} else {
  // В production режиме отдаем собранные статические файлы
  app.use(express.static(path.join(__dirname, "..", "dist")));

  // Для всех остальных запросов отдаем index.html (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
