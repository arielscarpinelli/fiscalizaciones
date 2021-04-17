const UNIDOS_API_URI = "https://afiliate.unidosargentina.org/api";
const UNIDOS_API_EMAIL = process.env.UNIDOS_API_EMAIL;
const UNIDOS_API_PASSWORD = process.env.UNIDOS_API_PASSWORD;

const SECRET = process.env.SECRET || "secret";
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

const MAIL_CONFIG = require("./mail");

const URL_BACKOFFICE_FRONTEND = process.env.URL_BACKOFFICE_FRONTEND;
const URL_VOTING_FRONTEND = process.env.URL_VOTING_FRONTEND;

module.exports = {
  UNIDOS_API_URI,
  UNIDOS_API_EMAIL,
  UNIDOS_API_PASSWORD,
  MAIL_CONFIG,
  SECRET,
  SESSION_SECRET,
  URL_BACKOFFICE_FRONTEND,
  URL_VOTING_FRONTEND,
};
