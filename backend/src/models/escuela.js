"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Escuela extends Model {
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
      this.fiscales = this.hasMany(models.Fiscal, {
        foreignKey: 'escuela',
      });
      this.mesas = this.hasMany(models.Mesa, {
          foreignKey: 'escuela',
      });
    }

  }
  Escuela.init(
    {
      codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      distrito: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seccion_electoral: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      circuito: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lat_lon: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false,
        defaultValue: { type: 'Point', coordinates: [0, 0]}
      },
    },
    {
      sequelize,
      modelName: "Escuela",
      tableName: "Escuelas",
      timestamps: false,
    }
  );

  return Escuela;
};
