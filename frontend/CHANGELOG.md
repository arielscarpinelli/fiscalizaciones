# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.13] - 2020-12-06

### Changed
- La barra de navegación ya no se superpone en el logo.

### Removed
- Se quitaron los campos Jurisdicción, Provincia y Localidad del CRUD de Votaciones.

## [0.0.12] - 2020-12-01
### Added
- Módulo de creación de usuarios.
## [0.0.11] - 2020-11-30
### Added
- Servidor express para mostrar la aplicación en modo productivo.
## [0.0.10] - 2020-11-28
### Changed
- Se corrigieron warnings de la aplicación. 

## [0.0.9] - 2020-11-28
### Added
- Se agregó una pantalla de inicio de sesión en el backoffice.
  
## [0.0.8] - 2020-11-17
### Added
- Archivo .env.production
## [0.0.7] - 2020-11-13
### Added
- Componente _NumberField_, permite al usuario ingresar un número.
- Se agregó el campo _Cantidad de representantes_ (quantityRepresentatives) al formulario de Posición.

### Changed
- Se actualizó la librería _react-scripts_ a la versión 3.4.4 para resolver vulnerabilidades.

## [0.0.6] - 2020-10-14
### Added
- CRUD Votaciones
- Componente _CandidateBasicPresentation_, que muestra la foto, el nombre y apellido del candidato. Puede ser utilizado donde sea conveniente.
- Componente _AgnosticAutocompleteField_, permite al usuario realizar búsquedas y mostrar los resultados de las mismas. Tambien se le permite elegir uno o varios resultados.
- Componente _DateField_, permite al usuario seleccionar una fecha.
- Componente _DateTimeField_, permite al usuario seleccionar una fecha y hora.
- Hook _useOuterClick_ que permite saber cuando un usuario haga click fuera de un componente.
- Util _debounce_ que permite hacer un [debounce](https://css-tricks.com/debouncing-throttling-explained-examples) de las funciones.

### Changed
- Ahora se pasa "...rest" como prop a todos componentes de formulario _(components/Forms)_, para permitir que el desarrollador pase props ajenas al componente. Todas las props se aplican al control, es decir al input, select, textarea, etc.

## [0.0.5] - 2020-10-08
### Added
- Ahora se muestra la foto del candidato en el listado de candidatos. En la vista de edición del candidato se puede modificar la foto de perfil.

### Changed
- Se corrigieron textos en las vistas de posiciones

## [0.0.4] - 2020-10-07
### Added
- CRUD Posiciones

### Changed
- Ahora se puede pasar _isLoading_ como prop al componente _SelectField_. Cuando _isLoading === true_ se muestra un Spinner de carga para indicar al usaurio que las opciones están siendo cargadas.

## [0.0.3] - 2020-10-07
### Added
- Input para formularios. Están conectados a react-hook-form.
- CRUD Candidatos
- Librerías:
  - Toastify: para envío de notificaciones in-app.
  - react-hook-form: para facilitar el control de los formularios.
  - Joi: para hacer validaciones en el front. Se usa la misma librería en el backend, por lo que se pueden usar las mismas reglas.
  - @hookform/resolvers: para utilizar Joi en react-hook-form

## [0.0.2] - 2020-09-30
### Added
- Este archivo (CHANGELOG.md) donde se llevará un registro de todo el avance del proyecto.
- Imagen de marca del Partido.
- Maquetación básica
- Componente Navbar, que contiene el logo de Unidos. Permitirá al usuario navegar por las distintas secciones.

### Changed
- Se agregó el componente Navbar al layout principal

## [0.0.1] - 2020-09-30
- Inicio del proyecto. Se creó utilizando la estructura planteada en [@unidosargentina/react-skeleton](https://github.com/unidosargentina/react-skeleton)
