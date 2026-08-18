const express = require("express");
const {
  createOrder,
  getMyOrders
} = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/my", authenticateToken, getMyOrders);

module.exports = router;