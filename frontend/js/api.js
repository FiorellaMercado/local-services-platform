import { API_URL } from "./config.js";

export async function apiFetch(ruta) {
    const respuesta = await fetch(`${API_URL}/${ruta}`);
    if (!respuesta.ok){
        throw new Error('La API respondió con error ' + respuesta.status)
    }
    const contenido = await respuesta.json()
    console.log(contenido)
    return contenido
}