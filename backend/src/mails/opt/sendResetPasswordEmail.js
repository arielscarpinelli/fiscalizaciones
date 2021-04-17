const mailer = require("../index");
const {
  MAIL_CONFIG: { from },
  URL_BACKOFFICE_FRONTEND,
} = require("../../config");

const sendResetPasswordEmail = (email, token) => {
  const subject =
    "Restablece tu acceso al Sistema de Votación | Unidos Argentina";

  const link = `${URL_BACKOFFICE_FRONTEND}/autenticacion/restablecer-clave?token=${token}`;

  return mailer.sendMail({
    from,
    subject,
    template: "resetPassword",
    to: email,
    context: {
      link,
      subject,
    },
  });
};

module.exports = sendResetPasswordEmail;
