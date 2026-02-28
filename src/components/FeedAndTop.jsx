import { useState } from "react";
import Feed from "./Feed";
import TopCats from "./TopCats";
import styles from "./FeedAndTop.module.css";

export default function FeedAndTop() {
  const [topCats, setTopCats] = useState([]);
  const [feedItems, setFeedItems] = useState([]);

  const handleTopCatsUpdate = (updatedCats) => {
    setTopCats(updatedCats);
  };

  const handleCatRemoved = (removedCat) => {
    // Возвращаем котика в ленту при 0 голосов
    if (removedCat) {
      setFeedItems((prev) => {
        if (prev.some((cat) => cat.id === removedCat.id)) {
          return prev;
        }
        return [removedCat, ...prev];
      });

      setTopCats((prev) => prev.filter((c) => c.id !== removedCat.id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <TopCats
          topCats={topCats}
          setTopCats={setTopCats}
          onCatRemoved={handleCatRemoved}
        />
      </div>
      <div className={styles.feedSection}>
        <Feed
          onTopCatsUpdate={handleTopCatsUpdate}
          setTopCats={setTopCats}
          feedItems={feedItems}
          setFeedItems={setFeedItems}
          topCats={topCats}
        />
      </div>
    </div>
  );
}
