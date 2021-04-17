const mailer = require("../index");
const {
  MAIL_CONFIG: { from },
} = require("../../config");

const sendTestMail = async () => {
  return mailer.sendMail({
    from,
    subject: "Test mail",
    template: "test",
    to: "votaciones@unidosargentina.org"
  });
};

module.exports = sendTestMail;
