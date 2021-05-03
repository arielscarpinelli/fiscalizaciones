const express = require("express");

const router = express.Router();

const {
  getEscuelas,
  getEscuela,
  postEscuela,
  putEscuela,
  deleteEscuela,
} = require("../controllers/escuelas");

router.get("/", getEscuelas);
router.get("/:id", getEscuela);
router.post("/", postEscuela);
router.put("/:id", putEscuela);
router.delete("/:id", deleteEscuela);

module.exports = router;
