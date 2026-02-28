import { useState, useEffect } from "react";
import styles from "./RandomCat.module.css";

export default function RandomCat() {
  const [catUrl, setCatUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRandomCat = async () => {
    setLoading(true);
    try {
      // Используем публичный API CATAAS
      const randomId = Math.floor(Math.random() * 1000000);
      const url = `https://cataas.com/cat?width=400&height=320&type=square&timestamp=${randomId}`;

      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
        setCatUrl(url);
      });
    } catch (error) {
      console.error("Ошибка загрузки котика:", error);
      // Fallback URL
      setCatUrl("https://cataas.com/cat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomCat();
  }, []);

  return (
    <section className={styles.randomCat}>
      <h2 className={styles.title}>Случайный смешной котик</h2>
      <p className={styles.subtitle}>
        Нажми на кнопку, чтобы увидеть нового рандомного котика.
      </p>
      <div>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={loadRandomCat}
          disabled={loading}
        >
          {loading ? "Загружаем котика..." : "Показать случайного котика"}
        </button>
      </div>

      <div className={styles.imageWrapper}>
        {catUrl && (
          <img
            src={catUrl}
            alt="Случайный смешной котик"
            className={styles.image}
            style={{ opacity: loading ? 0.5 : 1 }}
          />
        )}
      </div>
    </section>
  );
}
