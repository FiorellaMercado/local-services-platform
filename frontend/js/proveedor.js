import { apiFetch, apiPOST} from "./api.js";
import { crearElemento, dibujarElemento, formatearFecha, mostrarMensaje } from "./ui.js";

const params = new URLSearchParams(window.location.search);
const id = params.get('id')
async function getProvider(providerId) {
    const mensaje = document.getElementById('ui-state')
    mostrarMensaje(mensaje,'Cargando...')

    


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
        reviews.replaceChildren();

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

async function iniciarFormulario(providerId) {
    const formulario = document.getElementById('review-form')
    const mensaje = document.getElementById('review-message')

    const autor=document.getElementById('form-author')
    const rating=document.getElementById('form-rating')
    const comentario=document.getElementById('form-comment')

    formulario.addEventListener('submit', async (event)=>{
        event.preventDefault()

        mostrarMensaje(mensaje, 'Enviando...')
        const boton = document.getElementById('review-button')
        boton.disabled= true;
        const datos = {
            author: autor.value,
            rating: Number(rating.value),
            comment: comentario.value
        }
        console.log(datos)
        try{
            await apiPOST(`proveedores/${providerId}/resenas`, datos)
            mostrarMensaje(mensaje, 'Reseña enviada correctamente')
            setTimeout(() => {
                mostrarMensaje(mensaje, '');
            }, 2000);
            formulario.reset();
            await getProvider(providerId);
        }catch(error){
            mostrarMensaje(mensaje, 'No se pudo enviar su resena')
            console.error(error)
        }finally{
            boton.disabled = false;
        }
    })
    
}
getProvider(id)
iniciarFormulario(id)
