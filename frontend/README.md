# Información sobre la estructura del proyecto
Ver más en [@unidosargentina/react-skeleton](https://github.com/unidosargentina/react-skeleton/)

### Instalación y puesta en marcha
1) Descargar el proyecto.
2) Ejecutar `npm install && (cd server && npm install)` 
3) Puesta en marcha
   - Para desarrollo: 
        1) Copiar el archivo `.env.example` de la carpeta raiz al archivo `.env`.
        2) Ejecutar `npm run start`.
    - Para producción atras de proxy (Apache/nginx/etc):
        1) `npm run build` 
        2) Asegurarse que el Apache apunta a la carpeta `build/static`.
    - Para producción standalone
        1) En la carpeta `./server`, copiar el archivo `ecosystem.config.js.example` al archivo `ecosystem.config.js`.
        2) Asignarle el puerto deseado dentro del archivo `ecosystem.config.js`.
        3) Volver a la carpeta raíz y ejecutar `npm run prod`.
		
			

### Directorios *(/src)*
- `/api/`: 
	- `apiClient.js`: implementación del cliente de Axios para llamadas a la API.
	- `modules/`: directorio que aloja las implementaciones de los distintos servicios a utilizar. Por ejemplo, los servicios de autenticación y registro podrían convivir dentro de `auth.api.js` o `user.api.js`.
	Idealmente el nombre de archivo de cada módulo debería cumplir con la nomenclatura: `*.api.js`.
		-	`example.api.js`: archivo de ejemplo de una implementación de la API.
- `/components/`: directorio que aloja de componentes de la aplicación. Idealmente tambien deberían separarse por módulos, para asi garantizar que el proyecto pueda escalar de manera ordenada, aunque es una decisión del equipo de desarrollo adoptar esta idea.
- `/config/`: directorio que aloja las configuraciones de la aplicación.
- `/context/`: directorio que aloja los [contextos](https://es.reactjs.org/docs/context.html) de la aplicación.
	- `UserContext.js`: ejemplo de implementación de un  contexto para manejar la autenticación de los usuarios.
- `/pages/`: directorio que aloja las distintas páginas de la aplicación. Idealmente cada página o sección deberia tener su directorio. Si se trata de una página con multiples subpáginas, cada una de ellas deberia tener su directorio dentro del directorio padre. Esto permitiría que el proyecto pueda escalar de manera ordenada, aunque tambien es una decisión del equipo de desarrollo adoptar esta idea.
- `/views/`: directorio que aloja los templates o layouts que se utilizan en la aplicación. No será necesario en aplicaciones donde el template o layout sea el mismo en todas las páginas.
- `/server/`: directorio que aloja un servidor Express que se encarga de servir el sitio compilado.

### Librerias
- [React](https://es.reactjs.org/) ^16.13.1
- [React DOM](https://es.reactjs.org/docs/react-dom.html) ^16.13.1
- [React Router DOM](https://reactrouter.com/web/guides/quick-start) ^5.2.0
- [React Scripts](https://github.com/facebook/create-react-app#readme) 3.4.3
- [Axios](https://github.com/axios/axios) ^0.20.0
- [Express](https://expressjs.com/es/) ^4.17.1
- [pm2](https://pm2.keymetrics.io/) ^4.5.0

# React

### `npm prod`
Compila la aplicación y levanta el servidor express utilizando pm2.
### `npm start`
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`
Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`
Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can’t go back!**
If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.
You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).
### Code Splitting
This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting
### Analyzing the Bundle Size
This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size
### Making a Progressive Web App
This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app
### Advanced Configuration
This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration
### Deployment
This section has moved here: https://facebook.github.io/create-react-app/docs/deployment
### `npm run build` fails to minify
This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify