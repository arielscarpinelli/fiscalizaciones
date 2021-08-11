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
        type: Sequelize.ENUM(["PENDIENTE", "ENCURSO", "CERRADA"]),
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Elecciones");
  },
};

