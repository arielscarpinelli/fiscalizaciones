const express = require("express");

const router = express.Router();

const {
  searchFiscales,
  getFiscal,
  postFiscal,
  putFiscal,
  deleteFiscal,
  uploadPhoto,
  getPhoto,
  loginFiscal,
  validateEmail,
  validatePhone,
  postResults,
} = require("../controllers/fiscales");

const authFiscal = require("../middlewares/authFiscal");
const { isAuthenticated } = require("../middlewares");

router.post("/login", loginFiscal);
router.post("/validate-email", authFiscal, validateEmail);
router.post("/validate-phone", authFiscal, validatePhone);

router.post("/result", authFiscal, postResults);
/*
router.get("/:id/photo", getPhoto);
router.put("/:id/photo", isAuthenticated, uploadPhoto);
*/

router.get("/", isAuthenticated, searchFiscales);
router.get("/:id", isAuthenticated, getFiscal);
router.post("/", isAuthenticated, postFiscal);
router.put("/:id", isAuthenticated, putFiscal);
router.delete("/:id", isAuthenticated, deleteFiscal);

module.exports = router;
