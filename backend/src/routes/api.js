const express = require("express");

const router = express.Router();

const { isAuthenticated } = require("../middlewares");

const fiscalesRoutes = require("./fiscales");
const usersRoutes = require("./users");
const partidosRoutes = require("./partidos");
const authRoutes = require("./auth");

router.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API del Sistema de Fiscales de Republicanos Unidos",
  });
});

router.use("/fiscales", fiscalesRoutes);

router.use("/users", isAuthenticated, usersRoutes);

router.use("/partidos", isAuthenticated, partidosRoutes);

router.use("/auth", authRoutes);

module.exports = router;
