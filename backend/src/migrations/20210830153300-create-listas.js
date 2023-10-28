"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Listas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      eleccion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      distrito: {
        type: Sequelize.INTEGER,
      },
      seccion_electoral: {
        type: Sequelize.INTEGER,
      },
      lista: {
        type: Sequelize.STRING
      },
      cargos: {
        type: Sequelize.STRING
      }
    });
    await queryInterface.addIndex("Listas", {
      unique: true,
      fields: ['eleccion', 'distrito', 'seccion_electoral', 'lista']
    });
  },
  down: async (queryInterface, Sequelize) => {
  },
};

