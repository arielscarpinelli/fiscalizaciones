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
      
