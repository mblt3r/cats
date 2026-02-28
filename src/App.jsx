import { Routes, Route, NavLink } from "react-router-dom";
import RandomCat from "./components/RandomCat";
import TinderCats from "./components/TinderCats";
import CatChat from "./components/CatChat";
import FlappyCats from "./components/FlappyCats";
import FeedAndTop from "./components/FeedAndTop";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./App.module.css";
// дьявол носит прада, а котики — смешные рейтинги！
function App() {
  return (
    <div className={styles.container}>
      <ThemeToggle />

      <div className={styles.navigation}>
        <h1>🐱 Котики с рейтингом смешности</h1>

        <div className={styles.navButtons}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Топ 🔥
          </NavLink>

          <NavLink
            to="/random"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Случайный котик 🎲
          </NavLink>

          <NavLink
            to="/tinder"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Кототиндер 💕
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Чат 💬
          </NavLink>

          <NavLink
            to="/flappy"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Flappy Cats 🕹️
          </NavLink>
        </div>
      </div>

      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<FeedAndTop />} />
          <Route path="/tinder" element={<TinderCats />} />
          <Route path="/random" element={<RandomCat />} />
          <Route path="/chat" element={<CatChat />} />
          <Route path="/flappy" element={<FlappyCats />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
