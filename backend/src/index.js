const chalk = require("chalk");
const main = require("./app");

const port = process.env.PORT || 5000;

main
  .run()
  .then((app) => {
    app.listen(port, () => {
      console.log(
        `${chalk.green(
          "[FISCALES]"
        )} Disponible en: http://localhost:${port} `
      );
    });
  })
  .catch((error) => {
    console.error(`${chalk.red("[FISCALES]")} ${error.message}`);
    process.exit(1);
  });
