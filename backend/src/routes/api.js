const express = require("express");

const router = express.Router();

const { isAuthenticated } = require("../middlewares");

const fiscalesRoutes = require("./fiscales");
const usersRoutes = require("./users");
const partidosRoutes = require("./partidos");
const escuelasRoutes = require("./escuelas");
const actasRoutes = require("./actas");
const authRoutes = require("./auth");

router.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API del Sistema de Fiscalización",
  });
});

router.use("/fiscales", isAuthenticated, fiscalesRoutes);

router.use("/users", isAuthenticated, usersRoutes);

router.use("/partidos", isAuthenticated, partidosRoutes);

router.use("/escuelas", isAuthenticated, escuelasRoutes);

router.use("/actas", actasRoutes);

router.use("/auth", authRoutes);

module.exports = router;
