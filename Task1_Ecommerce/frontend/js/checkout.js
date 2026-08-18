function loadSummary() {
  const summary = document.getElementById("summary");
  const cart = getCart();

  if (!cart.length) {
    summary.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  let total = 0;

  summary.innerHTML = cart.map(item => {
    const line = item.price * item.quantity;
    total += line;

    return `
      <div class="summary-row">
        <span>${escapeHtml(item.name)} × ${item.quantity}</span>
        <strong>${money(line)}</strong>
      </div>
    `;
  }).join("") + `
    <div class="summary-row">
      <strong>Total</strong>
      <strong>${money(total)}</strong>
    </div>
  `;
}

document.getElementById("checkoutForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = getToken();
  const message = document.getElementById("message");
  const address = document.getElementById("address").value.trim();
  const cart = getCart();

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  if (!cart.length) {
    message.textContent = "Your cart is empty.";
    return;
  }

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        address,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      })
    });

    const data = await response.json();
    message.textContent = data.message;

    if (data.success) {
      localStorage.removeItem("cart");

      setTimeout(() => {
        window.location.href = "orders.html";
      }, 1000);
    }
  } catch (error) {
    message.textContent = "Could not place order.";
  }
});

loadSummary();