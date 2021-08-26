### Instalación y puesta en marcha
1) Descargar el proyecto.
2) Ejecutar `npm install`
3) Puesta en marcha
   * Para desarrollo: 
      0) En otro tab, `docker-compose up`
      1) `cp .env.example .env`.
      2) Correr migraciones `cd src && npx sequelize-cli db:migrate`
	  3) Ejecutar `npm run dev`.
   * Para producción:
      1) `cp ecosystem.config.js.example ecosystem.config.js`.
      2) CONFIGURAR LOS VALORES
      3) Ejecutar `npm run prod`.
      
       
      
# Crear base de escuelas desde padron

Los codigos de escuela son unicos por distrito

```
insert into Escuelas (distrito, seccion_electoral, partido, codigo, nombre, direccion, localidad, circuito, prioridad, min_mesa, max_mesa, lat_lon)
select 2 as distrito, cod_sec as seccion_electoral, 1 as partido, id_estab as codigo, establecimiento as nombre, domicilio as direccion, localidad, circ as circuito, prioridad, min_mesa, max_mesa, ST_GeomFromText('POINT(0 0)') as lat_lon
from lugares;
```

      
## Crear tabla de secciones electorales (no la usa la app, pero sirve para reporting)

CREATE TABLE `Seccion_Electoral` (`distrito` int NOT NULL,`seccion_electoral` int NOT NULL,`nombre` varchar(255),`division` int, PRIMARY KEY (distrito, seccion_electoral));
Datos en https://docs.google.com/spreadsheets/d/1000d1-lIrSWx3Fsuuuw_59c0oKwYl97p5nMbkq17Lsg/edit#gid=831429320


