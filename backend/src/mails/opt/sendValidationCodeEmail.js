const mailer = require("../index");
const {
  MAIL_CONFIG: { from },
} = require("../../config");

const sendValidationCodeEmail = (email, code) => {
  const subject = "Código de verificación";

  return mailer.sendMail({
    from,
    subject,
    template: "validationCode",
    to: email,
    context: {
      code,
      subject,
    },
  });
};

module.exports = sendValidationCodeEmail;
