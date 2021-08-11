"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {

  class Acta extends Model {
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
      this.fiscal = this.belongsTo(models.Fiscal, {
        foreignKey: 'fiscal',
        as: 'fiscal_'
      });
    }
  }

  Acta.init({
      eleccion: {
        type: DataTypes.INTEGER,
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
      mesa: {
        // codigo de la mesa
        type: DataTypes.STRING,
        allowNull: false,
      },
      electores: {
        type: DataTypes.INTEGER,
      },
      sobres: {
        type: DataTypes.INTEGER,
      },
      foto: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      fiscal: {
        type: DataTypes.INTEGER,
      }
    },
    {
      sequelize,
      modelName: "Acta",
      tableName: "Actas",
    }
  );

  class ActaDetalle extends Model {
    static associate(models) {
      this.acta = this.belongsTo(models.Acta, {
        foreignKey: 'acta',
        as: 'acta_'
      });
    }
  }

  ActaDetalle.init({
      acta: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM(["LISTA", "NULOS", "BLANCOS", "RECURRIDOS", "IMPUGNADO", "COMANDO"]),
      },
      lista: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cargo: {
        type: DataTypes.ENUM(["SENADORES_NACIONALES", "DIPUTADOS_NACIONALES", "SENADORES_PROVINCIALES", "DIPUTADOS_PROVINCIALES", "CONCEJALES"]),
      },
      votos: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ActaDetalle",
      tableName: "ActasDetalle",
    }
  );

  Acta.actas = Acta.hasMany(ActaDetalle, {
    foreignKey: 'acta',
    as: 'actas'
  });

  return Acta;
};
