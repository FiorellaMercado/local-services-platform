
const { prisma } = require('../config/db')

// funcion que valida
function esValido(valor) {
    if (valor === undefined || typeof valor === 'string') {
        return true
    }
    return false
}
//obtener proveedores
const listProviders = async (req, res) => {

    const categoria = req.query.category
    let texto = req.query.search
    const sort = req.query.sort || 'name' //valores por defecto
    const orden = req.query.orden || 'asc'

    const sortValidos = ['reviewsCount', 'average', 'name']
    const ordenValidos = ['asc', 'desc']


    if (!esValido(categoria) || !esValido(texto)) {
        return res.status(400).json({ error: 'filtro inválido' })
    }

    //estan o no en la lista de validos
    if (!sortValidos.includes(sort)) {
        return res.status(400).json({ error: 'sort inválido' })
    }
    if (!ordenValidos.includes(orden)) {
        return res.status(400).json({ error: 'orden inválido' })
    }

    //variable para acumular consulta where
    const where = {}

    // si hay categoria agregar el filtro
    if (categoria) {
        where.category = { slug: categoria }
    }
    // si hay un texto de busqueda recortar y agregar
    if (texto) {
        texto = texto.trim()
    }
    // buscar ese texto en lo mas comun nombre o descripcion
    if (texto) {
        where.OR = [
            { name: { contains: texto, mode: 'insensitive' } },
            { description: { contains: texto, mode: 'insensitive' } }
        ]
    }

    console.log(where)

    //almacenar lo que ira dentro de ordenby
    const orderBy = {}

    //si el orden es por promedios mandar los promedios nulos al final
    if (sort === 'average') {
        orderBy.average = { sort: orden, nulls: 'last' }
    } else {
        orderBy[sort] = orden
    }

    //hacer la consulta a la bd
    const proveedores = await prisma.provider.findMany({
        where: where,
        orderBy: orderBy,
        include: { category: true }
    })

    res.status(200).json(proveedores)
}

const providerById= async (req,res) =>{

    const id = Number(req.params.id)

    if(!id || !Number.isInteger(id)){
        return res.status(400).json({error: "proveedor invalido"})
    }

    const proveedor= await prisma.provider.findUnique({
        where:{id:id},
        include:{ //include para traer ya la categoria y usarla directo lo mismo reviews para no llamar a fetch muchas veces
            category:true,
            reviews:{
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    })

    
    if (!proveedor){
        return res.status(404).json({error:"proveedor no encontrado"})
    }

    res.status(200).json(proveedor)
}

module.exports={listProviders,providerById}