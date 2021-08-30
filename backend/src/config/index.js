const SECRET = process.env.SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

const MAIL_CONFIG = require("./mail");

const URL_BACKOFFICE_FRONTEND = process.env.URL_BACKOFFICE_FRONTEND || ("https://" + process.env.WEBSITE_HOSTNAME + "/admin");

const SUPERADMIN_INITIAL_PASSWORD = process.env.SUPERADMIN_INITIAL_PASSWORD;

const UPLOAD_PATH = process.env.UPLOAD_PATH || "/home/uploads";

module.exports = {
  MAIL_CONFIG,
  SECRET,
  SESSION_SECRET,
  URL_BACKOFFICE_FRONTEND,
  SUPERADMIN_INITIAL_PASSWORD,
  UPLOAD_PATH
};
