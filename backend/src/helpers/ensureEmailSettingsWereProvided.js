const chalk = require("chalk");
const { MAIL_CONFIG } = require("../config");
const InvalidEmailSettingsException = require("../exceptions/InvalidEmailSettingsException");

const isProduction = process.env.NODE_ENV === "production";

const ensureEmailSettingsWereProvided = () => {
  const {
    host,
    port,
    secure,
    auth: { user, pass },
    tls,
  } = MAIL_CONFIG;

  if (!isProduction) {
    console.log(
      `${chalk.yellow(
        "[SMTP-SETTINGS-CHECK]"
      )} Esta verificación sólo se ejecuta en el modo productivo`
    );
    return false;
  }

  console.log(
    `${chalk.yellow(
      "[SMTP-SETTINGS-CHECK]"
    )} Verificando la configuración del servidor SMTP`
  );

  if (!host || !port || !user || !pass) {
    console.error(
      `${chalk.red(
        "[SMTP-SETTINGS-CHECK]"
      )} La configuración del servidor SMTP es incorrecta.`
    );
    throw new InvalidEmailSettingsException();
  }

  console.log(
    `${chalk.green(
      "[SMTP-SETTINGS-CHECK]"
    )} La configuración del servidor SMTP es correcta.`
  );
};

module.exports = ensureEmailSettingsWereProvided;
