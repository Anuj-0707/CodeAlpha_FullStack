const pool = require("../config/db");

async function getProducts(req, res) {
  try {
    const [products] = await pool.execute(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not load products"
    });
  }
}

async function getProductById(req, res) {
  try {
    const [products] = await pool.execute(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({ success: true, product: products[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not load product"
    });
  }
}

module.exports = { getProducts, getProductById };