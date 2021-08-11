"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Actas", {
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
        allowNull: false,
      },
      seccion_electoral: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mesa: {
        // codigo de la mesa
        type: Sequelize.STRING,
        allowNull: false,
      },
      electores: {
        type: Sequelize.INTEGER,
      },
      sobres: {
        type: Sequelize.INTEGER,
      },
      foto: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      fiscal: {
        type: Sequelize.INTEGER,
      }
    });

    await queryInterface.createTable("Actas_Detalle", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      acta: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM(["LISTA", "NULOS", "BLANCOS", "RECURRIDOS", "IMPUGNADO", "COMANDO"]),
      },
      lista: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cargo: {
        type: Sequelize.ENUM(["SENADORES_NACIONALES", "DIPUTADOS_NACIONALES", "SENADORES_PROVINCIALES", "DIPUTADOS_PROVINCIALES", "CONCEJALES"]),
      },
      votos: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Actas");
    await queryInterface.dropTable("Actas_Detalle");
  },
};

