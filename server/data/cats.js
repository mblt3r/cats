let currentSort = "funny"; // funny | not-funny
let topFunnyCats = [];
// Множество imagePath уже добавленных в топ котиков (для проверки при создании новых)
const addedToTop = new Set();

function setMessage(text, isError = false) {
  const box = document.getElementById("cats-message");
  box.textContent = text || "";
  box.classList.remove("message--error", "message--success");
  if (!text) {
    return;
  }
  box.classList.add(isError ? "message--error" : "message--success");
}

function renderTopFunny() {
  const container = document.getElementById("top-container");
  if (!container) return;

  container.innerHTML = "";

  if (!topFunnyCats.length) {
    const empty = document.createElement("p");
    empty.className = "top-funny__empty";
    empty.textContent =
      "Пока никто не попал в топ. Отметь смешного котика в ленте!";
    container.appendChild(empty);
    return;
  }

  const list = [...topFunnyCats];
  if (currentSort === "funny") {
    list.sort((a, b) => b.votes - a.votes);
  } else {
    list.sort((a, b) => a.votes - b.votes);
  }

  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "top-card";

    const img = document.createElement("img");
    img.className = "top-card__image";
    // Используем сохранённый URL как есть (уже содержит уникальный timestamp и catId)
    img.src = item.imagePath;
    img.alt = "Котик из топа";
    img.loading = "lazy";
    img.decoding = "async";

    const footer = document.createElement("div");
    footer.className = "top-card__footer";

    const leftSection = document.createElement("div");
    leftSection.style.display = "flex";
    leftSection.style.alignItems = "center";
    leftSection.style.gap = "8px";

    const label = document.createElement("span");
    label.className = "top-card__label";
    label.textContent = "Голоса";

    const votes = document.createElement("span");
    votes.className = "top-card__votes";
    votes.textContent = String(item.votes);

    leftSection.appendChild(label);
    leftSection.appendChild(votes);

    const voteControls = document.createElement("div");
    voteControls.className = "top-card__vote-controls";

    const decrementBtn = document.createElement("button");
    decrementBtn.className = "top-card__vote-btn";
    decrementBtn.textContent = "−";
    decrementBtn.title = "Уменьшить рейтинг";
    decrementBtn.addEventListener("click", async () => {
      await updateVote(item.imagePath, "decrement");
    });

    const incrementBtn = document.createElement("button");
    incrementBtn.className = "top-card__vote-btn";
    incrementBtn.textContent = "+";
    incrementBtn.title = "Увеличить рейтинг";
    incrementBtn.addEventListener("click", async () => {
      await updateVote(item.imagePath, "increment");
    });

    voteControls.appendChild(decrementBtn);
    voteControls.appendChild(incrementBtn);

    footer.appendChild(leftSection);
    footer.appendChild(voteControls);

    card.appendChild(img);
    card.appendChild(footer);
    container.appendChild(card);
  });
}

async function updateVote(imagePath, action) {
  try {
    const endpoint =
      action === "increment"
        ? "/api/cats/top-funny/increment"
        : "/api/cats/top-funny/decrement";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imagePath }),
    });

    if (res.status === 401) {
      window.location.href = "/";
      return;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      setMessage("Не удалось обновить рейтинг.", true);
      return;
    }

    topFunnyCats = data;
    renderTopFunny();
  } catch (e) {
    console.error(e);
    setMessage("Ошибка при обновлении рейтинга.", true);
  }
}

function createFeedItem() {
  const item = document.createElement("article");
  item.className = "feed-item";

  const img = document.createElement("img");
  img.className = "feed-item__image";
  img.alt = "Котик из бесконечной ленты";

  // Уникальный идентификатор для каждого котика (timestamp + случайное число)
  const uniqueId =
    Date.now().toString() +
    "-" +
    Math.floor(Math.random() * 1_000_000).toString();

  // Полный URL для отображения (сохраняем его для топа, чтобы картинка не менялась)
  const fullImageUrl = `/api/cat-image?width=400&height=320&catId=${uniqueId}&timestamp=${uniqueId}`;
  img.src = fullImageUrl;

  // Сохраняем imagePath в data-атрибуте для проверки при удалении
  item.dataset.imagePath = fullImageUrl;

  const footer = document.createElement("div");
  footer.className = "feed-item__footer";

  const btn = document.createElement("button");
  btn.className = "button button--primary feed-item__button";
  btn.textContent = "Добавить в топ смешных";
  btn.addEventListener("click", async () => {
    try {
      // Сохраняем полный URL с timestamp, чтобы картинка не менялась
      const res = await fetch("/api/cats/top-funny", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagePath: fullImageUrl }),
      });
      if (res.status === 401) {
        window.location.href = "/";
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        setMessage("Не удалось обновить топ смешных котиков.", true);
        return;
      }
      topFunnyCats = data;
      // Добавляем в Set добавленных котиков
      addedToTop.add(fullImageUrl);
      // Удаляем элемент из ленты
      item.remove();
      renderTopFunny();
    } catch (e) {
      console.error(e);
      setMessage("Ошибка при обновлении топа.", true);
    }
  });

  footer.appendChild(btn);

  item.appendChild(img);
  item.appendChild(footer);
  return item;
}

function setFeedLoading(isLoading) {
  const loader = document.getElementById("feed-loader");
  if (!loader) return;
  loader.classList.toggle("feed-loader--visible", Boolean(isLoading));
  loader.setAttribute("aria-hidden", isLoading ? "false" : "true");
}

function loadMoreFeed(count = 6) {
  const feedContainer = document.getElementById("feed-container");
  if (!feedContainer) return;

  setFeedLoading(true);
  for (let i = 0; i < count; i++) {
    feedContainer.appendChild(createFeedItem());
  }
  // небольшая задержка для красоты, чтобы показать лоадер
  setTimeout(() => setFeedLoading(false), 250);
}

async function logout() {
  try {
    await fetch("/logout", { method: "POST" });
  } catch (e) {
    console.error(e);
  } finally {
    window.location.href = "/";
  }
}

async function fetchTopFunny() {
  try {
    const res = await fetch("/api/cats/top-funny");
    if (res.status === 401) {
      return;
    }
    const data = await res.json();
    topFunnyCats = Array.isArray(data) ? data : [];
    // Обновляем Set добавленных котиков
    addedToTop.clear();
    topFunnyCats.forEach((cat) => {
      addedToTop.add(cat.imagePath);
    });
    // Удаляем из ленты все котики, которые уже в топе
    const feedContainer = document.getElementById("feed-container");
    if (feedContainer) {
      const feedItems = feedContainer.querySelectorAll(".feed-item");
      feedItems.forEach((feedItem) => {
        const imagePath = feedItem.dataset.imagePath;
        if (imagePath && addedToTop.has(imagePath)) {
          feedItem.remove();
        }
      });
    }
    renderTopFunny();
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sortFunny = document.getElementById("sort-funny");
  const sortNotFunny = document.getElementById("sort-not-funny");
  const logoutBtn = document.getElementById("logout-btn");
  const randomCatBtn = document.getElementById("random-cat-btn");
  const randomCatImg = document.getElementById("random-cat-img");
  const feedContainer = document.getElementById("feed-container");

  if (sortFunny) {
    sortFunny.addEventListener("click", () => {
      currentSort = "funny";
      renderTopFunny();
    });
  }

  if (sortNotFunny) {
    sortNotFunny.addEventListener("click", () => {
      currentSort = "not-funny";
      renderTopFunny();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  if (randomCatBtn && randomCatImg) {
    randomCatBtn.addEventListener("click", async () => {
      // Показываем состояние загрузки
      randomCatBtn.disabled = true;
      randomCatBtn.textContent = "Загружаем котика...";
      randomCatImg.style.opacity = "0.5";

      try {
        // Same-origin прокси: фикс для ORB
        const url =
          "/api/cat-image?width=300&height=300&gif=1&says=LOL&fontSize=32&fontColor=white&filter=mono&type=square&timestamp=" +
          Date.now();

        await new Promise((resolve, reject) => {
          randomCatImg.onload = resolve;
          randomCatImg.onerror = () => {
            // Попробуем более простой вариант без фильтров
            const fallbackUrl = `/api/cat-image?width=300&height=300&gif=1&timestamp=${Date.now()}`;
            randomCatImg.onload = resolve;
            randomCatImg.onerror = reject;
            randomCatImg.src = fallbackUrl;
          };
          randomCatImg.src = url;
        });

        randomCatImg.style.opacity = "1";
      } catch (e) {
        console.error("Failed to load random cat image:", e);
        setMessage(
          "Не удалось загрузить случайного котика. Попробуйте еще раз.",
          true,
        );

        // Показываем заглушку
        randomCatImg.src = "";
        randomCatImg.style.opacity = "0.3";
      } finally {
        randomCatBtn.disabled = false;
        randomCatBtn.textContent = "Показать случайного котика";
      }
    });

    // Загружаем первого котика при загрузке страницы
    randomCatBtn.click();
  }

  fetchTopFunny();

  // Инициализация бесконечной ленты
  if (feedContainer) {
    loadMoreFeed(8);

    let isLoadingMore = false;
    window.addEventListener("scroll", () => {
      if (isLoadingMore) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 400;

      if (scrollPosition >= threshold) {
        isLoadingMore = true;
        loadMoreFeed(6);
        // простая защита от слишком частых срабатываний
        setTimeout(() => {
          isLoadingMore = false;
        }, 300);
      }
    });
  }
});
