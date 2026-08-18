function renderCart() {
  const container = document.getElementById("cartContainer");
  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty">
        <h3>Your cart is empty.</h3>
        <p>Browse products and add something you like.</p>
        <br>
        <a class="btn" href="index.html">Continue Shopping</a>
      </div>
    `;
    return;
  }

  let total = 0;

  const itemsHtml = cart.map((item, index) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${escapeHtml(item.name)}">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${money(item.price)} each</p>
        </div>
        <div class="cart-actions">
          <button class="btn secondary" onclick="changeQuantity(${index}, -1)">−</button>
          <strong>${item.quantity}</strong>
          <button class="btn secondary" onclick="changeQuantity(${index}, 1)">+</button>
        </div>
        <div>
          <strong>${money(lineTotal)}</strong><br>
          <button class="btn danger" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    ${itemsHtml}
    <div class="cart-total">
      <strong>Total: ${money(total)}</strong>
      <a class="btn" href="checkout.html">Proceed to Checkout</a>
    </div>
  `;
}

function changeQuantity(index, change) {
  const cart = getCart();
  const item = cart[index];

  item.quantity += change;

  if (item.quantity <= 0) {
    cart.splice(index, 1);
  } else if (item.quantity > item.stock) {
    item.quantity = item.stock;
  }

  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

renderCart();