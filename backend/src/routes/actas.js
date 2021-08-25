const express = require("express");

const router = express.Router();

const {
    getActaTemplate,
    getActasFiscal,
    postActaFiscal,
    getPhoto,
    putActaFiscal,
    getActasAdmin,
    getActaAdmin,
    getActaTemplateAdmin,
    putActaAdmin,
    postActaAdmin,
    deleteActaAdmin,

} = require("../controllers/actas");

const authFiscal = require("../middlewares/authFiscal");
const { isAuthenticated } = require("../middlewares");

router.get("/:id/photo", getPhoto);
router.get("/fiscal/template", authFiscal, getActaTemplate);
router.get("/fiscal", authFiscal, getActasFiscal);
router.post("/fiscal", authFiscal, postActaFiscal);
router.put("/fiscal/:id", authFiscal, putActaFiscal);

router.get("/", isAuthenticated, getActasAdmin);
router.post("/", isAuthenticated, postActaAdmin);
router.put("/:id", isAuthenticated, putActaAdmin);
router.get("/template", isAuthenticated, getActaTemplateAdmin);
router.get("/:id", isAuthenticated, getActaAdmin);
router.delete("/:id", isAuthenticated, deleteActaAdmin);

module.exports = router;
