import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TinderCats.module.css";

function createTinderCard() {
  const uniqueId = Math.floor(Math.random() * 1000000);

  const imageUrl = `https://cataas.com/cat?width=420&height=520&timestamp=${uniqueId}`;

  const firstNames = [
    "Мурзик",
    "Барсик",
    "Рыжик",
    "Тишка",
    "Симба",
    "Лео",
    "Оскар",
    "Макс",
    "Феликс",
    "Том",
    "Кузя",
    "Василий",
    "Пушок",
    "Снежок",
    "Борис",
    "Арчи",
    "Марс",
    "Зевс",
    "Аполлон",
    "Рокки",
    "Балу",
    "Мики",
    "Локи",
    "Тигр",
    "Черныш",
    "Смоки",
    "Багира",
    "Кеша",
    "Гарфилд",
    "Мурка",
  ];
  const bios = [
    "Люблю лежать на подоконнике и мурлыкать. Ищу того, кто будет чесать за ушком.",
    "Днём — сплю, ночью — охочусь за тапочками. Идеальный партнёр для ночных посиделок.",
    "Обожаю картонные коробки и лазерные указки. Приходи — будем играть!",
    "Серьёзный кот с мягким характером. Люблю колбасу и долгие объятия.",
    "Мастер прыжков на шкаф. Ищу человека, который не будет ругать за шалости.",
    "Элегантный джентльмен. Предпочитаю тихие вечера и хорошую музыку.",
    "Маленький хулиган с большим сердцем. Готов делиться своей энергией!",
    "Специалист по уюту. Создаю атмосферу комфорта и тепла в доме.",
    "Любопытный исследователь. Каждый день — новое приключение!",
    "Нежный и ласковый. Ищу руки, в которых можно свернуться клубочком.",
    "Король дивана. Приглашаю на совместный просмотр сериалов и сон.",
    "Обожаю еду! Если у тебя есть вкусняшки — мы уже друзья.",
    "Игривый и весёлый. Всегда готов к играм и забавам.",
    "Сплю по 18 часов в сутки. Ищу того, кто будет уважать мой режим.",
    "Мурчащий терапевт. Моё мурлыканье лечит любую хандру.",
  ];

  const name = firstNames[Math.floor(Math.random() * firstNames.length)];
  const bio = bios[Math.floor(Math.random() * bios.length)];
  const age = Math.floor(Math.random() * 12) + 1;
  const distanceKm = Math.floor(Math.random() * 50) + 1;

  return {
    id: uniqueId,
    imageUrl,
    name,
    bio,
    age,
    distanceKm,
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

    // Play sound effect
    const audio = new Audio(`https://mblt3r.github.io/cats/sounds/${type}.mp3`);
    audio.play().catch((error) => console.log("Audio play failed:", error));

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
    }, 900);
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
        <h2 className={styles.title}>КОТОТИНДЕР</h2>
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
                <div className={styles.cardInner}>
                  <img
                    className={styles.cardImage}
                    src={card.imageUrl}
                    alt="Котик для тиндера"
                    draggable={false}
                  />
                  <div className={styles.cardInfo}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardName}>
                        {card.name}, {card.age}
                      </h3>
                      <span className={styles.cardDistance}>
                        {card.distanceKm} км
                      </span>
                    </div>
                    <p className={styles.cardBio}>{card.bio}</p>
                  </div>
                  <div className={styles.badges}>
                    <div
                      className={styles.badgeNope}
                      style={{ opacity: Math.max(0, nopeStrength) }}
                    >
                      ФУ
                    </div>
                    <div
                      className={styles.badgeLike}
                      style={{ opacity: Math.max(0, likeStrength) }}
                    >
                      ЛАЙК
                    </div>
                  </div>
                  {isActing && action === "like" && (
                    <div className={styles.likeParticles}>
                      <span className={styles.heart}>❤️</span>
                      <span className={styles.sparkle}>✨</span>
                      <span className={styles.heart}>💖</span>
                      <span className={styles.sparkle}>✨</span>
                    </div>
                  )}
                  {isActing && action === "nope" && (
                    <div className={styles.nopeParticles}>
                      <span className={styles.poop}>💩</span>
                      <span className={styles.poop}>💩</span>
                    </div>
                  )}
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
