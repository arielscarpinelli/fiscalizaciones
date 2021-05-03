"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Escuelas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      codigo: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      distrito: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seccion_electoral: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      circuito: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      partido: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lat_lon: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false,
      },
    });
    await queryInterface.addIndex("Escuelas", ['distrito', 'codigo']);
    await queryInterface.addIndex("Escuelas", ['codigo']);
    await queryInterface.addIndex("Escuelas", ['partido']);
    await queryInterface.addIndex("Escuelas", ['distrito', 'seccion_electoral']);
    await queryInterface.addIndex("Escuelas", ['lat_lon']);
    await queryInterface.addIndex("Escuelas", ['nombre']);
    await queryInterface.addIndex("Escuelas", ['direccion']);
    await queryInterface.addIndex("Escuelas", ['circuito']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Escuelas");
  },
};

