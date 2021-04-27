"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'partido', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('Users', 'seccion_electoral', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('Users', 'distrito', { type: Sequelize.INTEGER });
    await queryInterface.addIndex("Users", ['partido']);
    await queryInterface.addIndex("Users", ['distrito', 'seccion_electoral']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'partido');
    await queryInterface.removeIndex("Users", ['partido']);
  },
};

