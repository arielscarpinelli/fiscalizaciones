const express = require("express");

const router = express.Router();

const {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  checkTokenValidity
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", postUser);
router.delete("/:id", deleteUser);

router.post('/check-token-validity', checkTokenValidity);

module.exports = router;
