"use strict";
const {Model} = require("sequelize");

const EleccionEstado = {
  PLANIFICADA: "PLANIFICADA",
  EN_CURSO: "EN_CURSO",
  CERRADA: "CERRADA"
}

module.exports = (sequelize, DataTypes) => {
  class Eleccion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static async findEnCurso() {
        return Eleccion.findOne({
          where: {
            estado: EleccionEstado.EN_CURSO
          },
        });
    }
  }

  Eleccion.init({
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estado: {
        type: DataTypes.ENUM(Object.values(EleccionEstado)),
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
      timestamps: false
    }
  );

  Eleccion.Estado = EleccionEstado;

  return Eleccion;
};
