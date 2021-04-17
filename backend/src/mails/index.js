const nodemailer = require("nodemailer");
const { MAIL_CONFIG } = require("../config");

const hbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport(MAIL_CONFIG);

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: "some/path", // don't remove.
      layoutsDir: "", // don't remove.
      defaultLayout: "", // don't remove.
    },
    viewPath: "./src/mails/templates/",
  })
);

module.exports = transporter;
