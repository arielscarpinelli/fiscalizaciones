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
      localidad: {
        type: DataTypes.STRING,
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
      prioridad: {
        type: DataTypes.INTEGER,
      },
      min_mesa: {
        type: DataTypes.INTEGER,
      },
      max_mesa: {
        type: DataTypes.INTEGER,
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
