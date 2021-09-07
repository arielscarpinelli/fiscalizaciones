"use strict";
const {Model, Op} = require("sequelize");

module.exports = (sequelize, DataTypes) => {

  class Listas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.partido = this.belongsTo(models.Eleccion, {
        foreignKey: 'eleccion',
        as: 'eleccion_'
      });
    }

    static async findForEleccion(eleccion, distrito, seccion_electoral) {
      return await Listas.findAll({
        where: {
          eleccion,
          distrito,
          seccion_electoral,
        }
      });
    }
  }

  Listas.init({
      eleccion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      distrito: {
        type: DataTypes.INTEGER,
      },
      seccion_electoral: {
        type: DataTypes.INTEGER,
      },
      lista: {
        type: DataTypes.STRING,
      },
      cargos: {
        type: DataTypes.STRING,
      }
    }, {
      sequelize,
      modelName: "Listas",
      tableName: "Listas",
      timestamps: false,
    }
  );

  return Listas;
};
