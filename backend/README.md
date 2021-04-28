### Instalación y puesta en marcha
1) Descargar el proyecto.
2) Ejecutar `npm install`
3) Puesta en marcha
   * Para desarrollo: 
      1) Copiar el archivo `.env.example` al archivo `.env`.
      2) Copiar el archivo `src/config/config.json.example` al archivo `src/config/config.json`
      3) Correr migraciones `cd src && npx sequelize-cli db:migrate`
	  4) Ejecutar `npm run dev`.
   * Para producción:
      1) Copiar el archivo `ecosystem.config.js.example` al archivo `ecosystem.config.js`.
      2) Copiar el archivo `src/config/config.json.example` al archivo `src/config/config.json`
      3) CONFIGURAR LOS VALORES EN AMBOS ARCHIVOS
      4) Correr migraciones `cd src && npx sequelize-cli db:migrate`
      5) Ejecutar `npm run prod`.