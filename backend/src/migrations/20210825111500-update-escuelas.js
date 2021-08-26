"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Mesas");
    await queryInterface.addColumn('Escuelas', 'localidad', { type: Sequelize.STRING });
    await queryInterface.addColumn('Escuelas', 'prioridad', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('Escuelas', 'min_mesa', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('Escuelas', 'max_mesa', { type: Sequelize.INTEGER });
    await queryInterface.addIndex("Escuelas", ['distrito', 'seccion_electoral', 'min_mesa']);
  },
  down: async (queryInterface, Sequelize) => {
  },
};

