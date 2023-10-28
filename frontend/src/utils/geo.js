import seccionesRaw from "assets/json/secciones.json";

const secciones = seccionesRaw.sort((a, b) => {
    if (a.seccion > b.seccion) {
        return 1;
    }
    if (a.seccion < b.seccion) {
        return -1;
    }
    // a must be equal to b
    return 0;
});

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

export const getSeccionesElectoralesByDistrito = (distrito) => seccionesByDistrito[Number(distrito)] || [];

export const getSeccionElectoral = (distrito, id) => {
    return seccionesById[distrito + "-" + id];
}

export const distritos = [
    { value: 1, text: "CABA" },
    { value: 2, text: "PBA" },
    { value: 3, text: "Catamarca" },
    { value: 4, text: "Córdoba" },
    { value: 5, text: "Corrientes" },
    { value: 6, text: "Chaco" },
    { value: 7, text: "Chubut" },
    { value: 8, text: "Entre Ríos" },
    { value: 9, text: "Formosa" },
    { value: 10, text: "Jujuy" },
    { value: 11, text: "La Pampa" },
    { value: 12, text: "La Rioja" },
    { value: 13, text: "Mendoza" },
    { value: 14, text: "Misiones" },
    { value: 15, text: "Neuquén" },
    { value: 16, text: "Rio Negro" },
    { value: 17, text: "Salta" },
    { value: 18, text: "San Juan" },
    { value: 19, text: "San Luis" },
    { value: 20, text: "Santa Cruz" },
    { value: 21, text: "Santa Fe" },
    { value: 22, text: "Stgo del Estero" },
    { value: 23, text: "Tucumán" },
    { value: 24, text: "Tierra del Fuego" }];

const distritosById = distritos
    .reduce((acc, s) => {
        acc[s.value] = s;
        return acc;
    }, {});


export const getDistrito = (distrito) => (distritosById[Number(distrito)] || {}).text;

export const DISTRITO_DEFAULT = 2;