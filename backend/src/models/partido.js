"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Partido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

  }
  Partido.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Partido",
      tableName: "Partidos",
      timestamps: false,
    }
  );

  return Partido;
};
