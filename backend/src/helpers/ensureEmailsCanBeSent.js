const chalk = require("chalk");
const sendTestMail = require("../mails/opt/testMail");

const isProduction = process.env.NODE_ENV === "production";

const ensureEmailsCanBeSent = async () => {
  if (!isProduction) {
    console.log(
      `${chalk.yellow(
        "[SMTP-TEST]"
      )} Esta verificación sólo se ejecuta en el modo productivo`
    );
    return false;
  }

  try {
    console.log(`${chalk.yellow("[SMTP-TEST]")} Enviando email de prueba`);
    const result = await sendTestMail();
    console.log(
      `${chalk.green("[SMTP-TEST]")} Email de prueba enviado con éxito!`
    );
  } catch (error) {
    console.error(
      `${chalk.red(
        "[SMTP-TEST]"
      )} Ha ocurrido un error al enviar el email de prueba`
    );
    throw error;
  }
};

module.exports = ensureEmailsCanBeSent;
