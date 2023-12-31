"use strict";
const { Model } = require("sequelize");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { SESSION_SECRET } = require("../config");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.partido = this.belongsTo(models.Partido, {
        foreignKey: 'partido',
        as: 'partido_'
      });
    }

    static getPartido(user) {
      // temporarly disabled
      // return (user.role !== "SUPERADMIN") && user.partido;
      return null;
    }

    static getDistrito(user) {
      return (user.role !== "SUPERADMIN") && user.distrito;
    }

    static getSeccionElectoral(user) {
      return (user.role !== "SUPERADMIN") && user.seccion_electoral;
    }

    static applyPrivilegesToQuery(req, skipPartido=false) {

      const queries = [];

      if (!skipPartido) {
        const partido = User.getPartido(req.user) || req.query.partido;

        if (partido) {
          queries.push({
            partido
          })
        }
      }

      const distrito = User.getDistrito(req.user) || req.query.distrito;

      if (distrito) {
        queries.push({
          distrito
        })
      }

      const seccion_electoral = User.getSeccionElectoral(req.user) || req.query.seccion;

      if (seccion_electoral) {
        queries.push({
          seccion_electoral
        })
      }

      return queries;
    }

  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM(["SUPERADMIN", "ADMIN", "OPERATOR"]),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.salt = crypto.randomBytes(16).toString("hex");

          const hashedPassword = crypto
            .pbkdf2Sync(value, this.salt, 10000, 100, "sha512")
            .toString("hex");

          this.setDataValue("password", hashedPassword);
        },
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resetToken: {
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
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.salt;
    delete values.resetToken;
    return values;
  };

  User.prototype.checkPassword = function (password) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 10000, 100, "sha512")
      .toString("hex");
    return this.password === hash;
  };

  User.prototype.generateResetToken = async function () {
    const token = crypto.randomBytes(64).toString("hex");
    this.resetToken = token;
    await this.save();
  };

  User.prototype.generateJWT = function () {
    const today = new Date();
    const expiration = (today.getTime() + 360000) / 1000;

    return jwt.sign(
      {
        id: this.id,
        email: this.email,
      },
      SESSION_SECRET,
      {
        expiresIn: "12h",
      }
    );
  };

  User.prototype.toAuthJSON = function () {
    return {
      email: this.email,
      role: this.role,
      token: this.generateJWT(),
      distrito: this.distrito,
      seccion_electoral: this.seccion_electoral,
      partido: this.partido,
    };
  };

  return User;
};
