const express = require("express");

const router = express.Router();

const {
  getMesas,
  getMesa,
  postMesa,
  putMesa,
  deleteMesa,
} = require("../controllers/mesas");

router.get("/", getMesas);
router.get("/:id", getMesa);
router.post("/", postMesa);
router.put("/:id", putMesa);
router.delete("/:id", deleteMesa);

module.exports = router;
