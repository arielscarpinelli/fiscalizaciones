const express = require("express");

const router = express.Router();

const {
  resetPassword,
  forgotPassword,
  loginUser,
} = require("../controllers/users");

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
