"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Mesa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.partido = this.belongsTo(models.Escuela, {
        foreignKey: 'escuela',
        as: 'escuela_'
      });
    }

  }
  Mesa.init(
    {
      codigo: {
        type: DataTypes.INTEGER,
      },
      electores_femeninos: {
        type: DataTypes.INTEGER,
      },
      electores_masculinos: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Mesa",
      tableName: "Mesas",
      timestamps: false,
    }
  );

  return Mesa;
};
