async function loadOrders() {
  const container = document.getElementById("ordersContainer");
  const token = getToken();

  if (!token) {
    container.innerHTML = `
      <div class="empty">
        <h3>Please login to view your orders.</h3>
        <br>
        <a class="btn" href="login.html">Login</a>
      </div>
    `;
    return;
  }

  try {
    const response = await fetch("/api/orders/my", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    if (!data.orders.length) {
      container.innerHTML = `
        <div class="empty">
          <h3>No orders yet.</h3>
          <br>
          <a class="btn" href="index.html">Start Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = data.orders.map(order => `
      <article class="order-card">
        <h3>Order #${order.id}</h3>
        <span class="status">${escapeHtml(order.status)}</span>
        <p><strong>Total:</strong> ${money(order.total_amount)}</p>
        <p><strong>Address:</strong> ${escapeHtml(order.address)}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString("en-IN")}</p>
        <hr>
        ${order.items.map(item => `
          <p>${escapeHtml(item.name)} × ${item.quantity} — ${money(item.price * item.quantity)}</p>
        `).join("")}
      </article>
    `).join("");
  } catch (error) {
    container.innerHTML = `<div class="empty">Unable to load orders.</div>`;
  }
}

loadOrders();