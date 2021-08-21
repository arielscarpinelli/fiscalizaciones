const fs = require('fs');

const config = {
  "development": {
    "username": "root",
    "password": null,
    "database": "fiscalizaciones",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "fiscalizaciones",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME || "fiscalizaciones",
    "host": process.env.DB_HOSTNAME,
    "dialect": "mysql",
    "dialectOptions": {
      "ssl": {
        "rejectUnauthorized": true,
        "ca": fs.readFileSync(__dirname + '/BaltimoreCyberTrustRoot.crt.pem')
      }
    }
  }
};

if (process.env.DB_SSL_IGNORE) {
  delete config.production.dialectOptions;
}

module.exports = config
