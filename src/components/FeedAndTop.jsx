import { useState, useRef } from "react";
import Feed from "./Feed";
import TopCats from "./TopCats";
import styles from "./FeedAndTop.module.css";

export default function FeedAndTop() {
  const [topCats, setTopCats] = useState([]);
  const feedRef = useRef(null);

  const handleTopCatsUpdate = (updatedCats) => {
    setTopCats(updatedCats);
  };

  const handleCatRemoved = (removedCat) => {
    // Возвращаем котика в ленту при 0 голосов
    if (feedRef.current) {
      feedRef.current.addCatBack(removedCat);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <TopCats topCats={topCats} onCatRemoved={handleCatRemoved} />
      </div>
      <div className={styles.feedSection}>
        <Feed ref={feedRef} onTopCatsUpdate={handleTopCatsUpdate} />
      </div>
    </div>
  );
}
