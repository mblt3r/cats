console.log("import.meta.env.DEV:", import.meta.env.DEV);
// В dev используем Vite proxy (localhost:5174 -> localhost:3001), поэтому пути относительные.
const API_BASE = "/api";
const AUTH_BASE = "/auth";

export const checkAuth = async () => {
  try {
    const response = await fetch(`${API_BASE}/cats/top-funny`, {
      credentials: "include",
    });
    return response.status !== 401;
  } catch (error) {
    return false;
  }
};

export const login = async (username, password) => {
  console.log("API запрос на вход:", { username, password });

  const response = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  console.log("Ответ сервера входа:", response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json();
    console.error("Ошибка входа:", error);
    throw new Error(error.error || error.message || "Ошибка входа");
  }

  const result = await response.json();
  console.log("Успешный вход:", result);
  return result;
};

export const register = async (username, password) => {
  console.log("API запрос на регистрацию:", { username, password });
  console.log("AUTH_BASE:", AUTH_BASE);
  console.log("Полный URL:", `${AUTH_BASE}/register`);

  const response = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  console.log("Ответ сервера:", response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json();
    console.error("Ошибка регистрации:", error);
    throw new Error(error.error || error.message || "Ошибка регистрации");
  }

  const result = await response.json();
  console.log("Успешная регистрация:", result);
  return result;
};

export const logout = async () => {
  console.log("API запрос на выход");
  const response = await fetch(`${AUTH_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  console.log("Ответ сервера выхода:", response.status, response.statusText);

  if (!response.ok) {
    throw new Error("Ошибка выхода");
  }
  return response.json();
};

export const getTopCats = async () => {
  const response = await fetch(`${API_BASE}/cats/top-funny`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Ошибка загрузки топа");
  return response.json();
};

export const incrementVote = async (imagePath) => {
  const response = await fetch(`${API_BASE}/cats/top-funny/increment`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imagePath }),
  });
  if (!response.ok) throw new Error("Ошибка обновления рейтинга");
  return response.json();
};

export const decrementVote = async (imagePath) => {
  const response = await fetch(`${API_BASE}/cats/top-funny/decrement`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imagePath }),
  });
  if (!response.ok) throw new Error("Ошибка обновления рейтинга");
  return response.json();
};

export const addFunnyVote = async (imagePath) => {
  const response = await fetch(`${API_BASE}/cats/top-funny`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imagePath }),
  });
  if (!response.ok) throw new Error("Ошибка добавления в топ");
  return response.json();
};
