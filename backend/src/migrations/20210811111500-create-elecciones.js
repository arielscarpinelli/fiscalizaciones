"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Elecciones", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      estado: {
        type: Sequelize.ENUM(["PLANIFICADA", "EN_CURSO", "CERRADA"]),
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Elecciones");
  },
};

