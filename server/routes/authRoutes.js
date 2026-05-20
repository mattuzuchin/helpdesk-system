const express = require("express");
const router = express.Router();
const routeMiddleware = require("../middleware/routeMiddleware");
const {
  loginUser,
  registerUser,
  logOutUser,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyResetToken
} = require("../controllers/authController");

// Route for user login
router.post("/login", loginUser);

// Route for user registration
router.post("/register", registerUser);

router.post("/logout", routeMiddleware, logOutUser);
router.patch("/changePassword", routeMiddleware, changePassword); 
router.patch("/forgotPW", forgotPassword);
router.patch("/resetPW", resetPassword);
router.post("/verifyResetToken", verifyResetToken);
module.exports = router;