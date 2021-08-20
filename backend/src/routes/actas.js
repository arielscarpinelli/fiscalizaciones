const express = require("express");

const router = express.Router();

const {
    getActaDefault,
    getActasFiscal,
    postActaFiscal,
    getPhoto
} = require("../controllers/actas");

const authFiscal = require("../middlewares/authFiscal");

router.get("/:id/photo", getPhoto);
router.get("/fiscal/default", authFiscal, getActaDefault);
router.get("/fiscal", authFiscal, getActasFiscal);
router.post("/fiscal", authFiscal, postActaFiscal);

module.exports = router;
