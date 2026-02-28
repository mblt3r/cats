import { useState, useEffect } from "react";
import styles from "./TopCats.module.css";

export default function TopCats({ topCats, setTopCats, onCatRemoved }) {
  const [loading, setLoading] = useState(false);
  const [sortedCats, setSortedCats] = useState([]);

  useEffect(() => {
    setSortedCats([...topCats].sort((a, b) => (b.votes || 0) - (a.votes || 0)));
  }, [topCats]);

  const handleVote = (catId, action) => {
    setTopCats((prev) => {
      const updated = prev
        .map((cat) => {
          if (cat.id === catId) {
            const newVotes = Math.max(
              0,
              (cat.votes || 0) + (action === "increment" ? 1 : -1),
            );

            // Если голоса стали 0, удаляем из топа
            if (newVotes === 0) {
              if (onCatRemoved) {
                onCatRemoved(cat);
              }
              return null;
            }

            return {
              ...cat,
              votes: newVotes,
            };
          }
          return cat;
        })
        .filter((cat) => cat !== null)
        .sort((a, b) => (b.votes || 0) - (a.votes || 0));

      return updated;
    });
  };

  if (loading) {
    return (
      <section className={styles.topFunny}>
        <h2 className={styles.title}>Топ самых смешных котиков</h2>
        <p className={styles.subtitle}>Загрузка...</p>
      </section>
    );
  }

  return (
    <section className={styles.topFunny}>
      <h2 className={styles.title}>Топ самых смешных котиков</h2>
      <p className={styles.subtitle}>
        Здесь появляются только котики, которых ты отметил как смешных в
        бесконечной ленте.
      </p>

      {sortedCats.length === 0 ? (
        <p className={styles.empty}>
          Пока никто не попал в топ. Отметь смешного котика в ленте!
        </p>
      ) : (
        <div className={styles.topGrid}>
          {sortedCats.map((cat, index) => (
            <article key={cat.id} className={styles.topCard}>
              <img
                src={cat.imagePath}
                alt="Котик из топа"
                className={styles.topCardImage}
                loading="lazy"
              />
              <div className={styles.topCardFooter}>
                <div className={styles.leftSection}>
                  <span className={styles.label}>Голоса</span>
                  <span className={styles.votes}>{cat.votes}</span>
                </div>
                <div className={styles.voteControls}>
                  <button
                    className={styles.voteBtn}
                    onClick={() => handleVote(cat.id, "decrement")}
                    title="Уменьшить рейтинг"
                  >
                    −
                  </button>
                  <button
                    className={styles.voteBtn}
                    onClick={() => handleVote(cat.id, "increment")}
                    title="Увеличить рейтинг"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
