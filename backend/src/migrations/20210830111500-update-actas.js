"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Actas', 'errores');
    await queryInterface.addColumn('Actas', 'escuela', { type: Sequelize.INTEGER });
    await queryInterface.addIndex("Actas", ['escuela']);
  },
  down: async (queryInterface, Sequelize) => {
  },
};

