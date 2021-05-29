1) Correr backend: Seguir instrucciones en backend/README.md
2) Correr frontend: Seguir instrucciones en frontend/README.md


## Deploy con docker como un único servicio FE+BE (para Azure)

```
cd frontend && npm install && REACT_APP_API_URI="/api/v1" npm run build && cd ..

docker build . -t fiscalizacion -t fiscalizacion.azurecr.io/fiscalizacion

az acr login --name fiscalizacion.azurecr.io
docker image push fiscalizacion.azurecr.io/fiscalizacion:latest
```


Se puede correr local con `docker run -p 8080:8080 -e DB_HOSTNAME=192.168.56.1 -e DB_USERNAME=root fiscalizacion `
