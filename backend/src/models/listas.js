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
      const listas = await Listas.findOne({
        where: {
          eleccion,
          distrito,
          [Op.or]: [{
            seccion_electoral
          }, {
            seccion_electoral: {
              [Op.eq]: null
            }
          }]
        },
        order: [['seccion_electoral', 'DESC']]
      })

      if (listas) {
        return listas.listas.split(",");
      }

      return null;
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
      listas: {
        type: DataTypes.TEXT,
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
