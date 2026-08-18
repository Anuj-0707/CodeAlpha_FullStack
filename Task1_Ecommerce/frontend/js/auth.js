const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("message");

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    message.textContent = data.message;

    if (data.success) {
      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);
    }
  } catch (error) {
    message.textContent = "Server error. Please try again.";
  }
});

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    message.textContent = data.message;

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "index.html";
    }
  } catch (error) {
    message.textContent = "Server error. Please try again.";
  }
});