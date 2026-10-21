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

    const nombre = crearElemento('p',proveedor.name)

    const categoria = crearElemento('span',proveedor.category.name)

    let contenido
    if (proveedor.average === null){
        contenido='Sin resenas'
    }else{
        contenido=proveedor.average.toFixed(1)
    }
    const calificacion = crearElemento('p',contenido)

    const detalle = crearElemento('a','Ver mas')
    detalle.href=`proveedor.html?id=${proveedor.id}`

    tarjeta.appendChild(nombre);
    tarjeta.appendChild(categoria);
    tarjeta.appendChild(calificacion);
    tarjeta.appendChild(detalle)

    return tarjeta
}