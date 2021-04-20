"use strict";
const { Model } = require("sequelize");
const { randomIntBetweenInterval } = require("../utils/numbers");

module.exports = (sequelize, DataTypes) => {
  class Fiscal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static async findByEmail(email) {
      return await Fiscal.findOne({
        where: {
          email
        },
      });
    }
  }
  Fiscal.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dni: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lat_lon: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false,
        defaultValue: { type: 'Point', coordinates: [0, 0]}
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      distrito: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      seccion_electoral: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      escuela: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mesa: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Fiscal",
      tableName: "Fiscales",
      timestamps: false,
    }
  );

  Fiscal.prototype.generateValidationCode = async function () {
    this.code = randomIntBetweenInterval(100000, 999999);
  };

  return Fiscal;
};
