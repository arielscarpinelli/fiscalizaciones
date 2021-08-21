const express = require("express");

const router = express.Router();

const {
    getActaTemplate,
    getActasFiscal,
    postActaFiscal,
    getPhoto,
    putActaFiscal
} = require("../controllers/actas");

const authFiscal = require("../middlewares/authFiscal");

router.get("/:id/photo", getPhoto);
router.get("/fiscal/template", authFiscal, getActaTemplate);
router.get("/fiscal", authFiscal, getActasFiscal);
router.post("/fiscal", authFiscal, postActaFiscal);
router.put("/fiscal/:id", authFiscal, putActaFiscal);

module.exports = router;
