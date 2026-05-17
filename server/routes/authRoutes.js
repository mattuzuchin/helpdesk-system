const express = require("express");
const router = express.Router();

const {
  loginUser,
  registerUser
} = require("../controllers/authController");

// Route for user login
router.post("/login", loginUser);

// Route for user registration
router.post("/register", registerUser);

module.exports = router;