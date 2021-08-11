const express = require("express");

const router = express.Router();

const {
  resetPassword,
  forgotPassword,
  loginUser,
} = require("../controllers/users");

const {
  loginFiscal,
  validateEmail,
} = require("../controllers/loginFiscal");

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/fiscal/login", loginFiscal);
router.post("/fiscal/validate-email", validateEmail);


module.exports = router;
