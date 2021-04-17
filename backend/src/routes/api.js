const express = require("express");

const router = express.Router();

const { isAuthenticated } = require("../middlewares");

const fiscalesRoutes = require("./fiscales");
const usersRoutes = require("./users");
const authRoutes = require("./auth");

router.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API del Sistema de Voto del Partido Unidos",
  });
});

router.use("/fiscales", fiscalesRoutes);

router.use("/users", isAuthenticated, usersRoutes);

router.use("/auth", authRoutes);

module.exports = router;
