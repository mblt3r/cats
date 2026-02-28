import { useState } from "react";
import RandomCat from "./components/RandomCat";
import TinderCats from "./components/TinderCats";
import CatChat from "./components/CatChat";
import FlappyCats from "./components/FlappyCats";
import FeedAndTop from "./components/FeedAndTop";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./App.module.css";

function App() {
  const [currentView, setCurrentView] = useState("random");

  const renderView = () => {
    switch (currentView) {
      case "random":
        return <RandomCat />;
      case "tinder":
        return <TinderCats />;
      case "chat":
        return <CatChat />;
      case "flappy":
        return <FlappyCats />;
      case "feedAndTop":
        return <FeedAndTop />;
      default:
        return <RandomCat />;
    }
  };

  return (
    <div className={styles.container}>
      <ThemeToggle />
      <div className={styles.navigation}>
        <h1>🐱 Котики с рейтингом смешности</h1>
        <div className={styles.navButtons}>
          <button
            className={currentView === "random" ? styles.active : ""}
            onClick={() => setCurrentView("random")}
          >
            Случайный котик
          </button>
          <button
            className={currentView === "tinder" ? styles.active : ""}
            onClick={() => setCurrentView("tinder")}
          >
            Tinder котики
          </button>
          <button
            className={currentView === "feedAndTop" ? styles.active : ""}
            onClick={() => setCurrentView("feedAndTop")}
          >
            Лента и Топ
          </button>
          <button
            className={currentView === "chat" ? styles.active : ""}
            onClick={() => setCurrentView("chat")}
          >
            Chat с котиком
          </button>
          <button
            className={currentView === "flappy" ? styles.active : ""}
            onClick={() => setCurrentView("flappy")}
          >
            Flappy Cats
          </button>
        </div>
      </div>
      <div className={styles.content}>{renderView()}</div>
    </div>
  );
}

export default App;
