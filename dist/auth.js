function selectTab(tab) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const buttons = document.querySelectorAll(".tab-button");

  buttons.forEach((btn) => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("tab-button--active", isActive);
  });

  loginForm.classList.toggle("form--active", tab === "login");
  registerForm.classList.toggle("form--active", tab === "register");
}

function showMessage(text, isError = false) {
  const box = document.getElementById("auth-message");
  box.textContent = text || "";
  box.classList.remove("message--error", "message--success");
  if (!text) {
    return;
  }
  box.classList.add(isError ? "message--error" : "message--success");
}

async function handleFormSubmit(event, url) {
  event.preventDefault();
  showMessage("");

  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      showMessage(data.error || "Произошла ошибка.", true);
      return;
    }

    showMessage("Готово! Перенаправляю к котикам...");
    setTimeout(() => {
      window.location.href = "cats.html";
    }, 700);
  } catch (e) {
    console.error(e);
    showMessage("Не удалось связаться с сервером.", true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      selectTab(tab);
    });
  });

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => handleFormSubmit(e, "/login"));
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) =>
      handleFormSubmit(e, "/register"),
    );
  }
});
