import secciones from "assets/json/secciones.json";

const seccionesByDistrito = secciones
    .reduce((acc, s) => {
        (acc[String(s.distrito)] = acc[String(s.distrito)] || []).push({
            value: s.secc,
            text: s.seccion
        })
        return acc;
    }, {});

const seccionesById = secciones
    .reduce((acc, s) => {
        acc[s.distrito + "-" + s.secc] = s;
        return acc;
    }, {});

export const getSeccionesElectoralesByDistrito = (distrito) => seccionesByDistrito[Number(distrito)];

export const getSeccionElectoral = (distrito, id) => seccionesById[distrito + "-" + id];

export const distritos = [
    { value: 2, text: "Buenos Aires" },
    { value: 1, text: "Capital Federal" },
];        