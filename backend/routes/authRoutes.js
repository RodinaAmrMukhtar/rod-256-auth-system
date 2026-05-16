const express = require("express");
const { registerUser, loginUser } = require("../services/authService");
const { verifyAuthToken } = require("../utils/rsaJwt");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "username, email, and password are required"
      });
    }

    const result = await registerUser(
      username,
      email,
      password,
      req.ip || "unknown"
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Register failed",
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password are required"
      });
    }

    const result = await loginUser(
      username,
      password,
      req.ip || "unknown"
    );

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
});

router.post("/verify-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      valid: false,
      message: "token is required"
    });
  }

  try {
    const decoded = verifyAuthToken(token);

    res.json({
      valid: true,
      algorithm: "RS256",
      message: "RSA JWT verification successful",
      decoded
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      message: "Invalid or expired token",
      error: error.message
    });
  }
});

module.exports = router;
