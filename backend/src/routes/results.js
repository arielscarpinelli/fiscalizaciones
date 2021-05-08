const express = require("express");

const router = express.Router();

const {
    uploadPhoto,
    getPhoto,
    loginFiscal,
    validateEmail,
    postResults,
} = require("../controllers/results");

const authFiscal = require("../middlewares/authFiscal");

router.post("/login", loginFiscal);
router.post("/validate-email", validateEmail);

router.post("/result", authFiscal, postResults);
router.put("/:id/photo", authFiscal, uploadPhoto);
router.get("/:id/photo", authFiscal, getPhoto);

module.exports = router;
