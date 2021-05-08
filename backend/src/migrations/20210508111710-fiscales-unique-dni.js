"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("Fiscales", ['dni']);
    await queryInterface.addIndex("Fiscales", ['dni'], {unique: true});
  },
  down: async (queryInterface, Sequelize) => {
  },
};

