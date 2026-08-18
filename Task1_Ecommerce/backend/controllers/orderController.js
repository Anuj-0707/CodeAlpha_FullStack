const pool = require("../config/db");

async function createOrder(req, res) {
  const connection = await pool.getConnection();

  try {
    const { items, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    if (!address || address.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid delivery address"
      });
    }

    await connection.beginTransaction();

    let total = 0;
    const checkedItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      const [rows] = await connection.execute(
        "SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE",
        [item.productId]
      );

      if (!rows.length) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const product = rows[0];

      if (product.stock < quantity) {
        throw new Error(`${product.name} does not have enough stock`);
      }

      const lineTotal = Number(product.price) * quantity;
      total += lineTotal;

      checkedItems.push({
        productId: product.id,
        quantity,
        price: Number(product.price)
      });
    }

    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_id, total_amount, address, status) VALUES (?, ?, ?, 'PLACED')",
      [req.user.id, total.toFixed(2), address.trim()]
    );

    const orderId = orderResult.insertId;

    for (const item of checkedItems) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.productId, item.quantity, item.price]
      );

      await connection.execute(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.productId]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId,
      total: Number(total.toFixed(2))
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message || "Could not place order"
    });
  } finally {
    connection.release();
  }
}

async function getMyOrders(req, res) {
  try {
    const [orders] = await pool.execute(
      `SELECT id, total_amount, address, status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await pool.execute(
        `SELECT oi.product_id, oi.quantity, oi.price, p.name
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not load orders"
    });
  }
}

module.exports = { createOrder, getMyOrders };