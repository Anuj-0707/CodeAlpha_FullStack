let allProducts = [];

async function loadProducts() {
  const grid = document.getElementById("productGrid");

  try {
    const response = await fetch("/api/products");
    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    allProducts = data.products;
    renderProducts(allProducts);
  } catch (error) {
    grid.innerHTML = `<div class="empty">Unable to load products.</div>`;
  }
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");

  if (!products.length) {
    grid.innerHTML = `<div class="empty">No products found.</div>`;
    return;
  }

  grid.innerHTML = products.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${escapeHtml(product.name)}">
      <div class="product-content">
        <small>${escapeHtml(product.category || "Product")}</small>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description.substring(0, 95))}...</p>
        <div class="price">${money(product.price)}</div>
        <a class="btn secondary" href="product.html?id=${product.id}">View Details</a>
        <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    if (existing.quantity < product.stock) existing.quantity++;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
      stock: product.stock
    });
  }

  saveCart(cart);
  alert("Product added to cart.");
}

document.getElementById("searchInput")?.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();

  renderProducts(
    allProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.category || "").toLowerCase().includes(query)
    )
  );
});

loadProducts();