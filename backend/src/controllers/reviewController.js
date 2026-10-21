const {prisma} = require('../config/db')


function esValido (rating, author, comment){
    if(!rating || typeof rating !== "number" || !Number.isInteger(rating) || rating > 5 || rating <1){
        return false
    }
    if(typeof author !== "string" || author.length < 2 || author.length > 60){
        return false
    }
    if(typeof comment !== "string" || comment.length > 200){
        return false
    }

    return true
    
}

const createReview=async(req, res)=>{

    const id = Number(req.params.id)
    const rating = req.body['rating'] 
    let author =req.body['author']
    let comment =req.body['comment'] || ""

    if(!id || typeof id !== "number" || !Number.isInteger(id)){
        return res.status(400).json({error: "Id invalido"})
    }

    if(typeof author == "string"){
        author=author.trim()
    }
    if(typeof comment == "string"){
        comment=comment.trim()
    }

    if(!esValido(rating, author, comment)){
        return res.status(400).json({error:"Resena invalida"})
    }

    const proveedor = await prisma.provider.findUnique({where : { id: id}})
    if (!proveedor){
        return res.status(404).json({error: "Proveedor no encontrado"})
    }

    
   
    const proveedorActualizado = await prisma.$transaction(async(tx)=>{
        const resena= await tx.review.create({data:{rating:rating, author: author, comment: comment || null, providerId: proveedor.id}})

        const promedio= await tx.review.aggregate({where:{providerId:proveedor.id},_avg:{rating:true}})
        const cuenta= await tx.review.aggregate({where:{providerId:proveedor.id},_count:{rating:true}})

        const proveedorActualizado=await tx.provider.update({where:{id:proveedor.id}, data:{average:promedio._avg.rating, reviewsCount: cuenta._count.rating}})
        return proveedorActualizado //SE NECESITA DE ESTE RETURN
    })


    res.status(201).json(proveedorActualizado)
}

module.exports={createReview}