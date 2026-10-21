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

export async function apiPOST(ruta, datos) {
    const respuesta = await fetch(`${API_URL}/${ruta}`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body : JSON.stringify(datos)
    })
    if(!respuesta.ok){
        throw new Error('La API respondió con error ' + respuesta.status)
    }
    const contenido = await respuesta.json()
    return contenido
}