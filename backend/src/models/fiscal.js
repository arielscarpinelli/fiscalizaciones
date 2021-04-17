"use strict";
const { Model } = require("sequelize");
const { randomIntBetweenInterval } = require("../utils/numbers");

module.exports = (sequelize, DataTypes) => {
  class Fiscal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Fiscal.init(
    {
      dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      login_step: {
        type: DataTypes.ENUM(
          "MUST_VALIDATE_EMAIL",
          "EMAIL_VALIDATED",
          "MUST_VALIDATE_PHONE",
          "READY_FOR_VOTE"
        ),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idProvincia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idDepartamento: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idMunicipio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idLocalidad: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Fiscal",
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
