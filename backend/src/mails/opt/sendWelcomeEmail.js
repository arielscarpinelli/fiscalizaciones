const mailer = require("../index");
const {
  MAIL_CONFIG: { from },
  URL_BACKOFFICE_FRONTEND,
} = require("../../config");

const sendWelcomeEmail = (email, token) => {
  const subject = "Acceso al Sistema de Votación | Unidos Argentina";

  const link = `${URL_BACKOFFICE_FRONTEND}/autenticacion/activar-cuenta?token=${token}`;

  return mailer.sendMail({
    from,
    subject,
    template: "welcomeEmail",
    to: email,
    context: {
      token,
      link,
      subject,
    },
  });
};

module.exports = sendWelcomeEmail;
