"use strict";
const {Model, Op, fn, col} = require("sequelize");

const ActaEstado = {
  INGRESADA: "INGRESADA",
  COMPLETADA: "COMPLETADA",
  VERIFICADA: "VERIFICADA",
  ILEGIBLE: "ILEGIBLE"
};

const ActaDetalleTipo = {
  LISTA: "LISTA",
  NULOS: "NULOS",
  BLANCOS: "BLANCOS",
  RECURRIDOS: "RECURRIDOS",
  IMPUGNADOS: "IMPUGNADOS",
  COMANDO: "COMANDO"
}

const ActaDetalleCargo = {
  PRESIDENTE: "PRESIDENTE",
  DIPUTADOS_NACIONALES: "DIPUTADOS_NACIONALES",
  LEGISLADORES_PROVINCIALES: 'LEGISLADORES_PROVINCIALES',
  CONCEJALES: "CONCEJALES"
}

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
      this.escuela = this.belongsTo(models.Escuela, {
        foreignKey: 'escuela',
        as: 'escuela_'
      });
      this.data_entry = this.belongsTo(models.User, {
        foreignKey: 'data_entry',
        as: 'data_entry_'
      });
      this.verificador = this.belongsTo(models.User, {
        foreignKey: 'verificador',
        as: 'verificador_'
      });
    }

    static async findForFiscalEleccionEnCurso(fiscal_) {
      const fiscal = fiscal_.id;
      const escuela = fiscal_.escuela;
      return Acta.findAll({
        include: [
          {
            association: 'eleccion_',
            where: {
              estado: 'EN_CURSO',
            }
          },
          'detalle'
        ],
        where: {
          [Op.or]: [{
            fiscal
          }, {
            escuela
          }]
        }
      })
    }

    static async findNextToCheck(query) {
      return Acta.findOne({
        include: [
          'detalle'
        ],
        where: {
          estado: {
            [Op.not]: ActaEstado.VERIFICADA
          },
          eleccion: query.eleccion
        },
        order: fn('rand'),
      })
    }

    updateLog() {
      let updatedLog = [];
      if (this.log) {
        updatedLog = JSON.parse(this.log);
      }
      const {log, ...json} = this.toJSON();
      updatedLog.push(json);
      this.log = JSON.stringify(updatedLog);
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
        // los codigos de mesa son unicos por distrito y seccion electoral
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
      foto2: {
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
      },
      estado: {
        type: DataTypes.ENUM(Object.values(ActaEstado)),
      },
      data_entry: {
        type: DataTypes.INTEGER
      },
      verificador: {
        type: DataTypes.INTEGER
      },
      escuela: {
        type: DataTypes.INTEGER
      },
      log: {
        type: DataTypes.TEXT
      }
    }, {
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
        type: DataTypes.ENUM(Object.values(ActaDetalleTipo)),
      },
      lista: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cargo: {
        type: DataTypes.ENUM(Object.values(ActaDetalleCargo)),
      },
      votos: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ActaDetalle",
      tableName: "Actas_Detalle",
      timestamps: false,
    }
  );

  Acta.detalle = Acta.hasMany(ActaDetalle, {
    foreignKey: 'acta',
    as: 'detalle'
  });

  Acta.ActaDetalle = ActaDetalle;
  Acta.Estado = ActaEstado;
  Acta.DetalleTipo = ActaDetalleTipo;
  Acta.DetalleCargo = ActaDetalleCargo;

  return Acta;
};
