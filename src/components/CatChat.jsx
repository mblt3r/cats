import { useEffect, useRef, useState } from "react";
import styles from "./CatChat.module.css";

function createCatMessage() {
  const names = [
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

  const spicyTopics = [
    { text: "Кто лучший: собаки или кошки? 😼", isDebate: true },
    { text: "Срочно! Колбаса украдена! 🚨", isDebate: false },
    { text: "Обожаю спать на клавиатуре! ⌨️", isDebate: false },
    { text: "Хозяин не даёт рыбку!! 😾", isDebate: true },
    { text: "Кто ночью бегает по стенам? 🏃‍♂️", isDebate: true },
    { text: "Нашёл идеальную коробку! 📦", isDebate: false },
    { text: "Лазерная указка — обман! 💔", isDebate: true },
    { text: "Днём сплю — это работа! 😴", isDebate: true },
    { text: "Тапочки вкуснее корма! 👟", isDebate: true },
    { text: "Хозяин гладит другого кота! 😱", isDebate: true },
    { text: "Снова ветер за окном! 🌬️", isDebate: false },
    { text: "Кто лучший охотник? 🏆", isDebate: true },
    { text: "Мурлыкаю громче всех! 🔊", isDebate: false },
    { text: "Штору можно уронить? 🤔", isDebate: true },
    { text: "Соседский пёс опять лает! 🐕", isDebate: true },
  ];

  const reactions = [
    "Согласен!",
    "Спорим!",
    "А вот и нет!",
    "100%",
    "Это точно!",
    "Бред!",
    "Лол!",
    "Ага!",
    "Никогда!",
    "Верно!",
    "Кто так думает?!",
    "Именно!",
    "Да ладно!",
    "Конечно!",
    "Нет!",
  ];

  const name = names[Math.floor(Math.random() * names.length)];
  const topic = spicyTopics[Math.floor(Math.random() * spicyTopics.length)];
  const hasReaction = Math.random() > 0.6 && topic.isDebate;
  const reaction = hasReaction
    ? reactions[Math.floor(Math.random() * reactions.length)]
    : null;

  const avatarSeed = name + Math.random().toString(36).substring(7);
  const avatarUrl = `/api/cat-image?width=48&height=48&catId=${avatarSeed}&timestamp=${Date.now()}`;

  return {
    id: Date.now().toString() + "-" + Math.random().toString(36).substring(2),
    name,
    avatarUrl,
    text: topic.text,
    reaction,
    timestamp: Date.now(),
  };
}

export default function CatChat() {
  const [messages, setMessages] = useState(() => [createCatMessage()]);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const MAX_MESSAGES = 100;

  const addNewMessage = () => {
    setMessages((prev) => {
      const newMsg = createCatMessage();
      const updated = [...prev, newMsg];
      return updated.length > MAX_MESSAGES
        ? updated.slice(-MAX_MESSAGES)
        : updated;
    });
  };

  // Auto-generate messages with random interval
  useEffect(() => {
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 16000) + 5000; // 5-21 seconds
      intervalRef.current = setTimeout(() => {
        addNewMessage();
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    const el = chatContainerRef.current;
    if (!el) return;

    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const handleChatScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;

    const thresholdPx = 24;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom <= thresholdPx;
  };

  return (
    <section className={styles.catChat}>
      <div className={styles.header}>
        <h2 className={styles.title}>ЧАТ КОТИКОВ 🔥</h2>
        <p className={styles.subtitle}>Жаркие споры и мурлыкающие обсуждения</p>
      </div>

      <div
        className={styles.chatContainer}
        ref={chatContainerRef}
        onScroll={handleChatScroll}
      >
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={styles.message}>
              <img
                className={styles.avatar}
                src={msg.avatarUrl}
                alt={msg.name}
              />
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.author}>{msg.name}</span>
                  <span className={styles.time}>
                    {new Date(msg.timestamp).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className={styles.text}>{msg.text}</p>
                {msg.reaction && (
                  <div className={styles.reaction}>{msg.reaction}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
    </section>
  );
}
