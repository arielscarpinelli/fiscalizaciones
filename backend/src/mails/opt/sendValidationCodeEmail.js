const mailer = require("../index");
const {
  MAIL_CONFIG: { from },
} = require("../../config");

const sendValidationCodeEmail = (email, code) => {
  const subject = "Verificá tu identidad antes de votar | Unidos Argentina";

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
