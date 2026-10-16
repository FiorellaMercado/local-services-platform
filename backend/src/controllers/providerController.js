
const { prisma } = require('../config/db')

function esValido(valor) {
    if (valor === undefined || typeof valor === 'string') {
        return true
    }
    return false
}

const listProviders = async (req, res) => {

    const categoria = req.query.category
    let texto = req.query.search
    const sort = req.query.sort || 'name'
    const orden = req.query.orden || 'asc'

    const sortValidos = ['reviewsCount', 'average', 'name']
    const ordenValidos = ['asc', 'desc']


    if (!esValido(categoria) || !esValido(texto)) {
        return res.status(400).json({ error: 'filtro inválido' })
    }


    if (!sortValidos.includes(sort)) {
        return res.status(400).json({ error: 'sort inválido' })
    }
    if (!ordenValidos.includes(orden)) {
        return res.status(400).json({ error: 'orden inválido' })
    }

    const where = {}

    if (categoria) {
        where.category = { slug: categoria }
    }

    if (texto) {
        texto = texto.trim()
    }

    if (texto) {
        where.OR = [
            { name: { contains: texto, mode: 'insensitive' } },
            { description: { contains: texto, mode: 'insensitive' } }
        ]
    }

    console.log(where)

    const orderBy = {}

    if (sort === 'average') {
        orderBy.average = { sort: orden, nulls: 'last' }
    } else {
        orderBy[sort] = orden
    }


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
        include:{
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