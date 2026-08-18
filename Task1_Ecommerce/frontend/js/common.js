function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countElement = document.getElementById("cartCount");
  if (!countElement) return;

  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  countElement.textContent = count;
}

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

function updateUserArea() {
  const area = document.getElementById("userArea");
  if (!area) return;

  const user = getUser();

  if (user) {
    area.innerHTML = `
      <span>Hello, ${escapeHtml(user.name)}</span>
      <a href="#" onclick="logout(); return false;">Logout</a>
    `;
  } else {
    area.innerHTML = `<a href="login.html">Login</a>`;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

updateCartCount();
updateUserArea();