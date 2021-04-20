import secciones from "assets/json/secciones.json";

export const getSeccionesByDistrito = (distrito) => {
    console.log(distrito);
    return secciones
        .filter(s => s.distrito == distrito)
        .map(s => {
            return {
                value: s.secc,
                text: s.seccion
            }
        })
    }

export const distritos = [
    { value: 2, text: "Buenos Aires" },
    { value: 1, text: "Capital Federal" },
];        