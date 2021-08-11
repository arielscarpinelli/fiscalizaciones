const express = require("express");

const router = express.Router();

const {
    getActasFiscal,
    uploadPhoto,
    getPhoto,
    postResults,
} = require("../controllers/actas");

const authFiscal = require("../middlewares/authFiscal");

router.get("/fiscal", authFiscal, getActasFiscal);
router.post("/", authFiscal, postResults);
router.put("/:id/photo", authFiscal, uploadPhoto);
router.get("/:id/photo", authFiscal, getPhoto);

module.exports = router;
