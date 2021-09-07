"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.remove('Listas', 'listas');
    await queryInterface.addColumn('Listas', 'lista', { type: Sequelize.STRING });
    await queryInterface.addColumn('Listas', 'cargos', { type: Sequelize.STRING });
    await queryInterface.removeIndex('Listas', 'listas_eleccion');
    await queryInterface.addIndex("Listas", {
      unique: true,
      fields: ['eleccion', 'distrito', 'seccion_electoral', 'lista']
    });
  },
  down: async (queryInterface, Sequelize) => {
  },
};

