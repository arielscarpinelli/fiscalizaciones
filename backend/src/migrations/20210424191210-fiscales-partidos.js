"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Fiscales', 'partido', { type: Sequelize.INTEGER });
    await queryInterface.addIndex("Fiscales", ['partido']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Fiscales', 'partido');
    await queryInterface.removeIndex("Fiscales", ['partido']);
  },
};

