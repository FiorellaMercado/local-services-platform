import { apiFetch } from "./api.js";
import { crearElemento, dibujarElemento, formatearFecha, mostrarMensaje } from "./ui.js";

async function getProvider() {
    const mensaje = document.getElementById('ui-state')
    mostrarMensaje(mensaje,'Cargando...')

    const params = new URLSearchParams(window.location.search);
    const providerId = params.get('id')


    try{
        if (!Number.isInteger(Number(providerId)) || Number(providerId)< 1 ){
            throw new Error('ID invalido')
        }

        const proveedor= await  apiFetch(`proveedores/${providerId}`)
        mostrarMensaje(mensaje,'' )

        dibujarElemento('name', proveedor.name)

        dibujarElemento('category', proveedor.category.name)

        dibujarElemento('phone', proveedor.phone)

        if (proveedor.average === null){
            dibujarElemento('rating', 'Sin resenas')
        }else{
            dibujarElemento('rating', proveedor.average)
        }

        dibujarElemento('reviews-count', proveedor.reviewsCount)

        dibujarElemento('description', proveedor.description)

        const reviews = document.getElementById('reviews')

        if (proveedor.reviews.length === 0){
            const reviewMensaje= document.createElement('p')

            reviewMensaje.textContent='No hay reviews todavia'
            reviews.appendChild(reviewMensaje)

        }else{
            for (const review of proveedor.reviews){

                const autor = crearElemento('p',review.author)

                const fecha = crearElemento('p',formatearFecha(review.createdAt))

                const calificacion = crearElemento('span',review.rating)

                
                const comentario = document.createElement('p')
                if(review.comment === null){
                    comentario.textContent='Sin comentarios'
                }else{
                    comentario.textContent=review.comment
                }

                reviews.appendChild(autor)
                reviews.appendChild(fecha)
                reviews.appendChild(calificacion)
                reviews.appendChild(comentario)

            }
        }
          
    }catch(error){
        mostrarMensaje(mensaje,'No se pudo cargar los datos del proveedor')
        console.error(error)
    }
}

getProvider()