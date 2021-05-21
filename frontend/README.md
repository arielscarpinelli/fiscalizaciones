# Información sobre la estructura del proyecto
Ver más en [@unidosargentina/react-skeleton](https://github.com/unidosargentina/react-skeleton/)

## Desarrollo
1) Descargar el proyecto.
2) Ejecutar `npm install && (cd server && npm install)` 
3) Puesta en marcha
4) Copiar el archivo .env `cp .env.example .env`
5) Ejecutar `npm run start`.

## Deployment
### Para todos 
1) Descargar el proyecto.
2) Ejecutar `npm install` 
3) Copiar el archivo .env `cp .env.example .env`
4) CONFIGURAR `.env` con la url de API de producción

### Para producción atras de proxy (Apache/nginx/etc)
- `npm run build` 
- Asegurarse que el Apache apunta a la carpeta `build`.

### Para producción standalone
- En la carpeta `./server`, copiar el archivo `ecosystem.config.js.example` al archivo `ecosystem.config.js`.
- Asignarle el puerto deseado dentro del archivo `ecosystem.config.js`.
- Volver a la carpeta raíz y ejecutar `npm run prod`.
		
			

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

