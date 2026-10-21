import { apiFetch, apiPOST} from "./api.js";
import { crearElemento, dibujarElemento, dibujarEstrellas, formatearFecha, mostrarMensaje } from "./ui.js";

const params = new URLSearchParams(window.location.search);
const id = params.get('id')

async function getProvider(providerId) {
    const mensaje = document.getElementById('ui-state')
    mostrarMensaje(mensaje,'Cargando...')

    try{

        const proveedor= await  apiFetch(`proveedores/${providerId}`)
        mostrarMensaje(mensaje,'' )

        dibujarElemento('name', proveedor.name)

        dibujarElemento('category', proveedor.category.name)

        dibujarElemento('phone', proveedor.phone)
        const telefono = document.getElementById('phone')
        telefono.href = `tel:${proveedor.phone}`

        if (proveedor.average === null){
            dibujarElemento('rating', 'Sin resenas')
        }else{
            dibujarElemento('rating', `Calificacion: ${proveedor.average}`) 
            dibujarElemento('reviews-count', `| ${proveedor.reviewsCount} resena/s`)

        }


        dibujarElemento('description', proveedor.description)

        const reviews = document.getElementById('reviews')
        reviews.replaceChildren();

        if (proveedor.reviews.length === 0){
            const reviewMensaje= document.createElement('p')

            reviewMensaje.textContent='No hay reviews todavia'
            reviews.appendChild(reviewMensaje)

        }else{
            for (const review of proveedor.reviews){

                const separador = document.createElement('div')
                separador.className='bg-gray-100 p-6 rounded-xl'

                const autor = crearElemento('p',review.author)
                autor.className='font-bold '

                const fecha = crearElemento('p',formatearFecha(review.createdAt))
                fecha.className='text-sm text-gray-400'

                const calificacion = crearElemento('span',dibujarEstrellas(review.rating))

                
                const comentario = document.createElement('p')
                if(review.comment === null){
                    comentario.textContent='Sin comentarios'
                }else{
                    comentario.textContent=review.comment
                }

                separador.appendChild(autor)
                separador.appendChild(fecha)
                separador.appendChild(calificacion)
                separador.appendChild(comentario)
                

                reviews.appendChild(separador)

            }
        }
        const seccionInfo = document.getElementById('info-section')
        const seccionForm = document.getElementById('form-section')
        const seccionReview= document.getElementById('review-section')
        seccionInfo.hidden= false
        seccionForm.hidden = false
        seccionReview.hidden= false
    }catch(error){
        mostrarMensaje(mensaje,'No se pudo cargar los datos del proveedor')
        console.error(error)
    }
}

function iniciarFormulario(providerId) {
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

function idValido(id){
    if (!Number.isInteger(Number(id)) || Number(id)< 1 ){
            const formulario = document.getElementById('review-form')
            formulario.hidden=true
            const mensaje = document.getElementById('ui-state')
            mostrarMensaje(mensaje,'ID invalido')
            throw new Error('ID invalido')
    }
    return true
}

if (idValido(id)){
    getProvider(id)
    iniciarFormulario(id)
}

