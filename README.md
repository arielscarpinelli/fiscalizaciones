1) Correr backend: Seguir instrucciones en backend/README.md
2) Correr frontend: Seguir instrucciones en frontend/README.md


## Deploy con docker como un único servicio FE+BE (para Cloud Run)

```
REACT_APP_API_URI='https://fiscalizacion.republicanosunidospba.com.ar/api/v1' cd frontend && npm install && npm run build && cd ..

docker build . -t fiscalizaciones
```


Se puede correr local con `docker run -p 8080:8080 fiscalizaciones `