const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters"
      });
    }

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "Registration successful"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email]
    );

    if (!users.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
}

module.exports = { register, login };