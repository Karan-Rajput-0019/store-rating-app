// backend/routes/auth.js
const express = require("express");
const authController = require("../controllers/authcontroller");
const {
  validateSignUp,
  validatePassword,
  handleValidationErrors,
} = require("../middleware/validation");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// register new user
router.post(
  "/register",
  validateSignUp,
  handleValidationErrors,
  authController.register
);

// login existing user
router.post("/login", authController.login);

// change password
router.post(
  "/change-password",
  authMiddleware,
  validatePassword,
  handleValidationErrors,
  authController.changePassword
);

module.exports = router;

