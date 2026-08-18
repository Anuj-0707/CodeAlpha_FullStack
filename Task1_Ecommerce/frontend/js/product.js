async function loadProduct() {
  const id = new URLSearchParams(window.location.search).get("id");
  const container = document.getElementById("productDetails");

  if (!id) {
    container.innerHTML = `<div class="empty">Product ID is missing.</div>`;
    return;
  }

  try {
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    const product = data.product;

    container.innerHTML = `
      <img src="${product.image}" alt="${escapeHtml(product.name)}">
      <div class="detail-info">
        <small>${escapeHtml(product.category || "Product")}</small>
        <h1>${escapeHtml(product.name)}</h1>
        <div class="price">${money(product.price)}</div>
        <p class="description">${escapeHtml(product.description)}</p>
        <p><strong>Available stock:</strong> ${product.stock}</p>

        <label for="quantity">Quantity</label>
        <input class="qty" id="quantity" type="number" min="1" max="${product.stock}" value="1">

        <button class="btn" id="addButton">Add to Cart</button>
      </div>
    `;

    document.getElementById("addButton").onclick = () => {
      const quantity = Number(document.getElementById("quantity").value);

      if (quantity < 1 || quantity > product.stock) {
        alert("Invalid quantity.");
        return;
      }

      const cart = getCart();
      const existing = cart.find(item => item.productId === product.id);

      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + quantity,
          product.stock
        );
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          quantity,
          stock: product.stock
        });
      }

      saveCart(cart);
      alert("Product added to cart.");
    };
  } catch (error) {
    container.innerHTML = `<div class="empty">Unable to load product.</div>`;
  }
}

loadProduct();