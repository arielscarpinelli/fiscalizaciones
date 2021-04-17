const fromName = process.env.EMAIL_FROM_NAME || "Unidos Argentina";
const fromMail =
  process.env.EMAIL_FROM_ADDRESS || "votaciones@unidosargentina.org";

module.exports = {
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true" ? true : false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true,
  fromName,
  fromMail,
  from: `${fromName} <${fromMail}>`,
};
