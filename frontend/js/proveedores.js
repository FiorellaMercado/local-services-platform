import { apiFetch } from "./api.js"
import { mostrarMensaje, crearElemento, crearTarjeta} from "./ui.js"
async function getProviders() {

    const lista = document.getElementById('list')
    const mensaje = document.getElementById('ui-state')

    mostrarMensaje(mensaje,'Cargando...')

    try{
        const proveedores=await apiFetch('proveedores')
        if(proveedores.length === 0){
            mostrarMensaje(mensaje,'Sin resultados');
        }else{
            mostrarMensaje(mensaje,'')
            for (const proveedor of proveedores){

                const tarjeta = crearTarjeta(proveedor)

                lista.appendChild(tarjeta)
            }
        }
        

    }catch(error){
        mostrarMensaje(mensaje,'No se pudieron cargar los proveedores')
        console.error(error)

    }
   
}

getProviders()