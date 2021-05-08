const express = require("express");

const router = express.Router();

const {
  searchFiscales,
  getFiscal,
  postFiscal,
  putFiscal,
  deleteFiscal,
} = require("../controllers/fiscales");

router.get("/", searchFiscales);
router.get("/:id", getFiscal);
router.post("/", postFiscal);
router.put("/:id", putFiscal);
router.delete("/:id", deleteFiscal);

module.exports = router;
