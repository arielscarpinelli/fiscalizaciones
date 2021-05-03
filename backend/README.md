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
      4) Correr migraciones `cd src && NODE_ENV=production npx sequelize-cli db:migrate`
      5) Ejecutar `npm run prod`.
      
      
      
# Crear base de escuelas desde padron

Los codigos de escuela son unicos por distrito

```
insert into Escuelas (codigo, nombre, direccion, distrito, seccion_electoral, circuito, partido, lat_lon)
select distinct codigo, local as nombre, direccion, distrito, secc as seccion_electoral, circu as circuito, 1 as partido, ST_GeomFromText('POINT(0 0)') as lat_lon
from Padron_2017
where distrito in (1, 2)
```

Los codigos de mesa son unicos por distrito y seccion electoral

```
insert into Mesas (escuela, codigo, electores_femeninos, electores_masculinos)
select e.id as escuela, mesa, Fem, Masc
from Padron_2017 p
inner join Escuelas e on p.distrito = e.distrito and e.codigo = p.codigo and p.secc = e.seccion_electoral
where p.distrito in (1, 2);

```
      