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
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      login_step: {
        type: DataTypes.ENUM(
          "MUST_VALIDATE_EMAIL",
          "EMAIL_VALIDATED",
          "MUST_VALIDATE_PHONE",
          "READY"
        ),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
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

  Fiscal.prototype.generateValidationCode = function () {
    this.code = randomIntBetweenInterval(100000, 999999);
  };

  Fiscal.prototype.mustValidateEmail = function () {
    this.login_step = "MUST_VALIDATE_EMAIL";
  };

  Fiscal.prototype.emailWasValidated = function () {
    this.login_step = "EMAIL_VALIDATED";
  };

  Fiscal.prototype.isReady = function () {
    return this.login_step === "READY";
  };

  Fiscal.prototype.ready = async function () {
    this.login_step = "READY";
    await this.save();
  };

  Fiscal.prototype.mustValidatePhone = function () {
    this.login_step = "MUST_VALIDATE_PHONE";
  };

  return Fiscal;
};
