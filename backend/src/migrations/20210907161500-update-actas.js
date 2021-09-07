"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Actas_Detalle', 'cargo', {
      type: Sequelize.ENUM(["DIPUTADOS_NACIONALES", "LEGISLADORES_PROVINCIALES", "CONCEJALES"]),
    });
  },
  down: async (queryInterface, Sequelize) => {
  },
};

