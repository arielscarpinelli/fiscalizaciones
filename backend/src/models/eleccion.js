"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Eleccion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }

  Eleccion.init({
      nombre: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      estado: {
        type: DataTypes.ENUM(["PENDIENTE", "ENCURSO", "CERRADA"]),
        allowNull: false,
      }
    },
    {
      sequelize,
      name: {
        singular: "Eleccion",
        plural: "Elecciones",
      },
      tableName: "Elecciones",
    }
  );

  return Eleccion;
};
