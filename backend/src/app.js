const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");

require("dotenv").config();

const {
  notFound,
  errorHandler,
  validationErrors,
} = require("./middlewares");

const apiRoutes = require("./routes/api");

const ensureEmailSettingsWereProvided = require("./helpers/ensureEmailSettingsWereProvided");
const ensureEmailsCanBeSent = require("./helpers/ensureEmailsCanBeSent");

const { SUPERADMIN_INITIAL_PASSWORD } = require("./config");

const run = async () => {
  console.log(
    `${chalk.yellow(
      "[SISTEMA-VOTO-BACKEND]"
    )} Iniciando servicio de votación...`
  );

  ensureEmailSettingsWereProvided();
  // await ensureEmailsCanBeSent();

  const app = express();

  app.use(
    fileUpload({
      createParentPath: true,
    })
  );

  const logLevel = process.env.NODE_ENV === "production" ? "tiny" : "dev";

  app.use(morgan(logLevel));
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/api/v1", apiRoutes);

  app.use(notFound);
  app.use(validationErrors);
  app.use(errorHandler);

  const { User } = require("./models/index");
  if (await User.count() === 0) {
    if(!SUPERADMIN_INITIAL_PASSWORD) {
      throw new Error("No se puede crear el usuario superadmin inicial, falta establecer password");
    }
    await User.create({
      email: 'admin@republicanosunidospba.com.ar',
      role: 'SUPERADMIN',
      password: SUPERADMIN_INITIAL_PASSWORD,
    });
  }


  const { Partido } = require("./models/index");
  if (await Partido.count() === 0) {
    await Partido.create({
      id: 1,
      name: 'Republicanos Unidos',
    });
  }

  return app;
};

module.exports = {
  run,
};
