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
        this.partido = this.belongsTo(models.Partido, {
            foreignKey: 'partido',
            as: 'partido_'
        });
        this.escuela = this.belongsTo(models.Escuela, {
            foreignKey: 'escuela',
            as: 'escuela_'
        });
        this.mesa = this.belongsTo(models.Mesa, {
            foreignKey: 'mesa',
            as: 'mesa_'
        });
    }

    static async findByDNI(dni) {
      return Fiscal.findOne({
        where: {
          dni
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
      name: {
          singular: "Fiscal",
          plural: "Fiscales",
      },
      tableName: "Fiscales",
      timestamps: false,
    }
  );

  Fiscal.prototype.generateValidationCode = function () {
    this.code = randomIntBetweenInterval(100000, 999999);
  };

  return Fiscal;
};
