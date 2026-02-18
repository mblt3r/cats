import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TinderCats.module.css";

function createTinderCard() {
  const uniqueId =
    Date.now().toString() +
    "-" +
    Math.floor(Math.random() * 1_000_000).toString();

  const imageUrl = `/api/cat-image?width=420&height=520&catId=${uniqueId}&timestamp=${uniqueId}&type=square`;

  return {
    id: uniqueId,
    imageUrl,
  };
}

export default function TinderCats() {
  const [cards, setCards] = useState(() => [
    createTinderCard(),
    createTinderCard(),
    createTinderCard(),
  ]);
  const [action, setAction] = useState(null);
  const [actingId, setActingId] = useState(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });

  const dragStartRef = useRef({ x: 0, y: 0 });
  const pointerIdRef = useRef(null);

  const topCard = cards[0] || null;

  const canAct = useMemo(
    () => Boolean(topCard) && !actingId,
    [topCard, actingId],
  );

  const act = (type) => {
    if (!topCard || actingId) return;

    setAction(type);
    setActingId(topCard.id);

    window.setTimeout(() => {
      setCards((prev) => {
        const rest = prev.slice(1);
        return [...rest, createTinderCard()];
      });
      setAction(null);
      setActingId(null);
      setDrag({ x: 0, y: 0, dragging: false });
    }, 420);
  };

  const onPointerDown = (e) => {
    if (!canAct) return;
    pointerIdRef.current = e.pointerId;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, dragging: true });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onPointerMove = (e) => {
    if (!drag.dragging) return;
    if (pointerIdRef.current !== e.pointerId) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDrag({ x: dx, y: dy, dragging: true });
  };

  const endDrag = () => {
    if (!drag.dragging) return;

    const threshold = 120;
    const dx = drag.x;

    if (Math.abs(dx) >= threshold) {
      act(dx > 0 ? "like" : "nope");
      return;
    }

    setDrag({ x: 0, y: 0, dragging: false });
  };

  const onPointerUp = (e) => {
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    endDrag();
  };

  const onPointerCancel = (e) => {
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    setDrag({ x: 0, y: 0, dragging: false });
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!canAct) return;
      if (e.key === "ArrowLeft") {
        act("nope");
      }
      if (e.key === "ArrowRight") {
        act("like");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canAct, topCard, actingId]);

  return (
    <section className={styles.tinder}>
      <div className={styles.header}>
        <h2 className={styles.title}>TINDER</h2>
        <p className={styles.subtitle}>Стрелки ← → тоже работают.</p>
      </div>

      <div className={styles.stack}>
        {cards
          .slice(0, 3)
          .reverse()
          .map((card, indexFromBack) => {
            const isTop = card.id === topCard?.id;
            const isActing = isTop && actingId === card.id;
            const z = indexFromBack + 1;

            const likeStrength = isTop
              ? Math.min(1, Math.max(0, drag.x / 140))
              : 0;
            const nopeStrength = isTop
              ? Math.min(1, Math.max(0, -drag.x / 140))
              : 0;

            const dragRotate = isTop
              ? Math.max(-18, Math.min(18, drag.x / 12))
              : 0;
            const dragTransform =
              isTop && drag.dragging
                ? `translateX(${drag.x}px) translateY(${Math.min(18, Math.max(-18, drag.y / 6))}px) rotate(${dragRotate}deg)`
                : undefined;

            return (
              <div
                key={card.id}
                className={`${styles.card} ${isTop ? styles.cardTop : ""} ${
                  isActing && action === "like" ? styles.cardLike : ""
                } ${isActing && action === "nope" ? styles.cardNope : ""}`}
                style={{
                  zIndex: z,
                  transform: dragTransform,
                  transition: isTop && drag.dragging ? "none" : undefined,
                }}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? onPointerUp : undefined}
                onPointerCancel={isTop ? onPointerCancel : undefined}
              >
                <img
                  className={styles.cardImage}
                  src={card.imageUrl}
                  alt="Котик для тиндера"
                />
                <div className={styles.badges}>
                  <div
                    className={styles.badgeLike}
                    style={{ opacity: Math.max(0, likeStrength) }}
                  >
                    ЛАЙК
                  </div>
                  <div
                    className={styles.badgeNope}
                    style={{ opacity: Math.max(0, nopeStrength) }}
                  >
                    ФУ
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.controlBtn} ${styles.nope}`}
          onClick={() => act("nope")}
          disabled={!canAct}
        >
          Фу
        </button>
        <button
          type="button"
          className={`${styles.controlBtn} ${styles.like}`}
          onClick={() => act("like")}
          disabled={!canAct}
        >
          Лайк
        </button>
      </div>
    </section>
  );
}
