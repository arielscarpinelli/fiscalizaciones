const express = require("express");

const router = express.Router();

const {
  getPartidos,
  getPartido,
  postPartido,
  putPartido,
  deletePartido,
} = require("../controllers/partidos");

router.get("/", getPartidos);
router.get("/:id", getPartido);
router.post("/", postPartido);
router.put("/:id", putPartido);
router.delete("/:id", deletePartido);

module.exports = router;
