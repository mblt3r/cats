import { useState, useEffect, useRef, useCallback } from "react";
import { getTopCats, addFunnyVote } from "../services/api";
import styles from "./Feed.module.css";

export default function Feed({ onTopCatsUpdate, onCatRemovedFromTop }) {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topCats, setTopCats] = useState([]);
  const [addedToTop, setAddedToTop] = useState(new Set());
  const loader = useRef(null);
  const pageRef = useRef(0);

  const createFeedItem = useCallback(() => {
    const uniqueId =
      Date.now().toString() +
      "-" +
      Math.floor(Math.random() * 1_000_000).toString();
    const fullImageUrl = `/api/cat-image?width=400&height=320&catId=${uniqueId}&timestamp=${uniqueId}`;

    return {
      id: uniqueId,
      imagePath: fullImageUrl,
      votes: 0,
    };
  }, []);

  const loadMoreFeed = useCallback(
    (count = 6) => {
      const startedAt = Date.now();
      setLoading(true);
      const newItems = [];
      for (let i = 0; i < count; i++) {
        newItems.push(createFeedItem());
      }

      setTimeout(() => {
        setFeedItems((prev) => [...prev, ...newItems]);
        const elapsed = Date.now() - startedAt;
        const minVisibleMs = 1100;
        const remaining = Math.max(0, minVisibleMs - elapsed);
        setTimeout(() => setLoading(false), remaining);
      }, 250);
    },
    [createFeedItem],
  );

  const handleAddToTop = async (imagePath) => {
    try {
      const updatedTop = await addFunnyVote(imagePath);
      setTopCats(updatedTop);
      setAddedToTop((prev) => new Set([...prev, imagePath]));
      setFeedItems((prev) =>
        prev.filter((item) => item.imagePath !== imagePath),
      );
      if (onTopCatsUpdate) {
        onTopCatsUpdate(updatedTop);
      }
    } catch (error) {
      console.error("Ошибка добавления в топ:", error);
    }
  };

  const fetchTopCats = async () => {
    try {
      const cats = await getTopCats();
      const previousCats = topCats;
      setTopCats(cats);

      // Находим котиков, которые были удалены из топа
      const removedCats = previousCats.filter(
        (prevCat) =>
          !cats.find((newCat) => newCat.imagePath === prevCat.imagePath),
      );

      // Добавляем удаленных котиков обратно в ленту
      if (removedCats.length > 0) {
        setFeedItems((prev) => [...removedCats, ...prev]);
        if (onCatRemovedFromTop) {
          onCatRemovedFromTop(removedCats);
        }
      }

      const addedPaths = new Set(cats.map((cat) => cat.imagePath));
      setAddedToTop(addedPaths);
      setFeedItems((prev) =>
        prev.filter((item) => !addedPaths.has(item.imagePath)),
      );
    } catch (error) {
      console.error("Ошибка загрузки топа:", error);
    }
  };

  useEffect(() => {
    fetchTopCats();
    loadMoreFeed(8);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading) {
          loadMoreFeed(6);
        }
      },
      {
        threshold: 1.0,
        rootMargin: "100px",
      },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loading, loadMoreFeed]);

  return (
    <section className={styles.infiniteFeed}>
      <div className={styles.feedHeader}>
        <div>
          <h2 className={styles.feedTitle}>Бесконечная лента котиков</h2>
          <p className={styles.feedSubtitle}>
            Листай вниз — новые котики будут подгружаться автоматически.
          </p>
        </div>
        {loading && (
          <div className={styles.feedLoader}>
            <div className={styles.feedLoaderSpinner}></div>
            <span className={styles.feedLoaderText}>Загружаем котиков…</span>
          </div>
        )}
      </div>

      <div className={styles.feedGrid}>
        {feedItems.map((item) => (
          <article key={item.id} className={styles.feedItem}>
            <img
              src={item.imagePath}
              alt="Котик из бесконечной ленты"
              className={styles.feedItemImage}
              loading="lazy"
            />
            <div className={styles.feedItemFooter}>
              <button
                className={`${styles.button} ${styles.buttonPrimary} ${styles.feedItemButton}`}
                onClick={() => handleAddToTop(item.imagePath)}
              >
                Добавить в топ смешных
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.feedFooter}>
        <div ref={loader} className={styles.loaderTrigger} />
      </div>

      {loading && (
        <div className={styles.bigBottomLoader}>
          <div className={styles.bigBottomLoaderInner}>
            <div className={styles.bigSpinner}></div>
            <div className={styles.bigTextBlock}>
              <div className={styles.bigTitle}>Загружаем котиков…</div>
              <div className={styles.bigSubtitle}>Ещё чуточку, мяу.</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
