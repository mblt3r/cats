const express = require("express");
const {
  getTopCats,
  addFunnyVote,
  incrementVote,
  decrementVote,
} = require("./data/topStore");

const router = express.Router();

// Кеш картинок по catId (в памяти, очищается при перезапуске)
const imageCache = new Map();

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

function pickQuery(req, keys) {
  const out = {};
  for (const k of keys) {
    const v = req.query?.[k];
    if (v === undefined || v === null || v === "") continue;
    out[k] = String(v);
  }
  return out;
}

function buildCataasUrl(req) {
  const tag = typeof req.query?.tag === "string" ? req.query.tag : "";
  const says = typeof req.query?.says === "string" ? req.query.says : "";
  const gif = req.query?.gif === "1" || req.query?.gif === "true";

  // Базовый путь
  let pathname = "/cat";

  // Комбинации по докам CATAAS
  if (gif && says) {
    pathname = `/cat/gif/says/${encodeURIComponent(says)}`;
  } else if (says && tag) {
    pathname = `/cat/${encodeURIComponent(tag)}/says/${encodeURIComponent(says)}`;
  } else if (says) {
    pathname = `/cat/says/${encodeURIComponent(says)}`;
  } else if (gif) {
    pathname = "/cat/gif";
  } else if (tag) {
    pathname = `/cat/${encodeURIComponent(tag)}`;
  }

  const allowed = pickQuery(req, [
    "type",
    "filter",
    "width",
    "height",
    "fontSize",
    "fontColor",
  ]);

  // timestamp и catId не передаём в CATAAS (они только для нашей логики)

  const url = new URL("https://cataas.com");
  url.pathname = pathname;
  for (const [k, v] of Object.entries(allowed)) {
    url.searchParams.set(k, v);
  }
  return url;
}

// Прокси картинки CATAAS (same-origin) — фикс для ORB/blocked-by-ORB
router.get("/cat-image", requireAuth, async (req, res) => {
  const catId = req.query?.catId;

  // Если есть catId и картинка уже закеширована, возвращаем её
  if (catId && imageCache.has(catId)) {
    const cached = imageCache.get(catId);
    res.setHeader("Content-Type", cached.contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Кешируем на год
    return res.status(200).send(cached.buffer);
  }

  const url = buildCataasUrl(req);

  try {
    const upstream = await fetch(url, {
      headers: {
        // Явно просим бинарную картинку
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      },
    });

    if (!upstream.ok) {
      return res
        .status(502)
        .json({ error: "Upstream error", status: upstream.status });
    }

    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";
    const buf = Buffer.from(await upstream.arrayBuffer());

    // Кешируем картинку, если есть catId
    if (catId) {
      imageCache.set(catId, { buffer: buf, contentType });
      // Ограничиваем размер кеша (максимум 100 картинок)
      if (imageCache.size > 100) {
        const firstKey = imageCache.keys().next().value;
        imageCache.delete(firstKey);
      }
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Cache-Control",
      catId ? "public, max-age=31536000" : "no-store",
    );
    return res.status(200).send(buf);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Proxy failed" });
  }
});

// Топ «самых смешных» котиков из бесконечной ленты
router.get("/cats/top-funny", requireAuth, (req, res) => {
  res.json(getTopCats());
});

router.post("/cats/top-funny", requireAuth, (req, res) => {
  const { imagePath } = req.body || {};
  if (!imagePath) {
    return res.status(400).json({ error: "imagePath is required" });
  }
  try {
    const top = addFunnyVote(imagePath);
    res.json(top);
  } catch (e) {
    if (e && e.message === "INVALID_IMAGE_PATH") {
      return res.status(400).json({ error: "Invalid imagePath" });
    }
    console.error(e);
    res.status(500).json({ error: "Failed to update funny top" });
  }
});

router.post("/cats/top-funny/increment", requireAuth, (req, res) => {
  const { imagePath } = req.body || {};
  if (!imagePath) {
    return res.status(400).json({ error: "imagePath is required" });
  }
  try {
    const top = incrementVote(imagePath);
    res.json(top);
  } catch (e) {
    if (e && e.message === "INVALID_IMAGE_PATH") {
      return res.status(400).json({ error: "Invalid imagePath" });
    }
    if (e && e.message === "CAT_NOT_FOUND") {
      return res.status(404).json({ error: "Cat not found" });
    }
    console.error(e);
    res.status(500).json({ error: "Failed to increment vote" });
  }
});

router.post("/cats/top-funny/decrement", requireAuth, (req, res) => {
  const { imagePath } = req.body || {};
  if (!imagePath) {
    return res.status(400).json({ error: "imagePath is required" });
  }
  try {
    const top = decrementVote(imagePath);
    res.json(top);
  } catch (e) {
    if (e && e.message === "INVALID_IMAGE_PATH") {
      return res.status(400).json({ error: "Invalid imagePath" });
    }
    if (e && e.message === "CAT_NOT_FOUND") {
      return res.status(404).json({ error: "Cat not found" });
    }
    console.error(e);
    res.status(500).json({ error: "Failed to decrement vote" });
  }
});

module.exports = router;
