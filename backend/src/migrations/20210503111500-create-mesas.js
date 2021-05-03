"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Mesas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      codigo: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      escuela: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      electores_femeninos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      electores_masculinos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
    await queryInterface.addIndex("Mesas", ['escuela']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Mesas");
  },
};

