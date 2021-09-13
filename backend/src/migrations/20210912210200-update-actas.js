"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Actas', 'estado', {
      type: Sequelize.ENUM(["INGRESADA", "COMPLETADA", "VERIFICADA", "ILEGIBLE"]),
    });
  },
  down: async (queryInterface, Sequelize) => {
  },
};

