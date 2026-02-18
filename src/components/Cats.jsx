import { useState, useEffect } from "react";
import RandomCat from "./RandomCat";
import TinderCats from "./TinderCats";
import CatChat from "./CatChat";
import FlappyCats from "./FlappyCats";
import TopCats from "./TopCats";
import Feed from "./Feed";
import { logout, getTopCats } from "../services/api";
import styles from "./Cats.module.css";

export default function Cats() {
  const [currentSort, setCurrentSort] = useState("funny");
  const [topCats, setTopCats] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      // Полная перезагрузка страницы для обновления состояния авторизации
      window.location.href = "/auth";
    } catch (error) {
      console.error("Ошибка выхода:", error);
      // В случае ошибки все равно пытаемся перейти на страницу авторизации
      window.location.href = "/auth";
    }
  };

  const handleTopCatsUpdate = (updatedCats) => {
    setTopCats(updatedCats);
  };

  const handleVoteUpdate = async () => {
    try {
      const cats = await getTopCats();
      setTopCats(cats);
    } catch (error) {
      console.error("Ошибка обновления топа:", error);
    }
  };

  const handleCatRemovedFromTop = (removedCats) => {
    console.log("Котики возвращены в ленту:", removedCats);
  };

  const handleCatRemoved = (removedCats) => {
    console.log("Котики удалены из топа:", removedCats);
  };

  useEffect(() => {
    const loadInitialTopCats = async () => {
      try {
        const cats = await getTopCats();
        setTopCats(cats);
      } catch (error) {
        console.error("Ошибка загрузки топа:", error);
      }
    };
    loadInitialTopCats();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarTitle}>Самые смешные котики</div>
        <div className={styles.topBarActions}>
          <button
            className={`${styles.button} ${styles.buttonGhost} ${currentSort === "funny" ? styles.buttonActive : ""}`}
            onClick={() => setCurrentSort("funny")}
          >
            Самые смешные
          </button>
          <button
            className={`${styles.button} ${styles.buttonGhost} ${currentSort === "not-funny" ? styles.buttonActive : ""}`}
            onClick={() => setCurrentSort("not-funny")}
          >
            Самые не смешные
          </button>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.topRow}>
          <RandomCat />
          <TinderCats />
        </div>
        <FlappyCats />
        <CatChat />
        <TopCats
          currentSort={currentSort}
          topCats={topCats}
          onVoteUpdate={handleVoteUpdate}
          onCatRemoved={handleCatRemoved}
        />
        <Feed
          onTopCatsUpdate={handleTopCatsUpdate}
          onCatRemovedFromTop={handleCatRemovedFromTop}
        />
      </main>
    </div>
  );
}
