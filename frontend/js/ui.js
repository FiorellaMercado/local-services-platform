export function mostrarMensaje(elemento, texto) {
    elemento.textContent=texto;
}

export function formatearFecha(fecha) {
    const fechaFormateada= new Date(fecha).toLocaleDateString('es-PY');
    return fechaFormateada
}

export function crearElemento(etiqueta, contenido){
    const elemento= document.createElement(etiqueta);
    elemento.textContent=contenido
    return elemento
}

export function dibujarElemento(id, contenido){
    const elemento= document.getElementById(id);
    elemento.textContent=contenido
}

export function crearTarjeta(proveedor){
    const tarjeta = document.createElement('div');
    tarjeta.className='p-6 rounded-xl bg-gray-100'
    const nombre = crearElemento('p',proveedor.name)
    nombre.className='font-bold '

    const categoria = crearElemento('span',proveedor.category.name)
    categoria.className='text-sm text-gray-400'

    let contenido
    if (proveedor.average === null){
        contenido='Sin reseñas'
    }else{
        contenido=proveedor.average.toFixed(1)
    }
    const calificacion = crearElemento('p',contenido)

    const detalle = crearElemento('a','Ver mas')
    detalle.href=`proveedor.html?id=${proveedor.id}`
    detalle.className = 'text-blue-600 underline hover:text-blue-800'

    tarjeta.appendChild(nombre);
    tarjeta.appendChild(categoria);
    tarjeta.appendChild(calificacion);
    tarjeta.appendChild(detalle)

    return tarjeta
}
export function dibujarEstrellas(rating){
    const estrellas='★'.repeat(rating)
    return estrellas
}