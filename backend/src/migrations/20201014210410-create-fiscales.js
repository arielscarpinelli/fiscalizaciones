"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Fiscales", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dni: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lat_lon: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false,
      },
      phone: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      distrito: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      seccion_electoral: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      escuela: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      mesa: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
    await queryInterface.addIndex("Fiscales", ['first_name']);
    await queryInterface.addIndex("Fiscales", ['last_name']);
    await queryInterface.addIndex("Fiscales", ['dni']);
    await queryInterface.addIndex("Fiscales", ['distrito', 'seccion_electoral']);
    await queryInterface.addIndex("Fiscales", ['escuela']);
    await queryInterface.addIndex("Fiscales", ['mesa']);
    await queryInterface.addIndex("Fiscales", ['lat_lon']);  
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Fiscales");
  },
};

