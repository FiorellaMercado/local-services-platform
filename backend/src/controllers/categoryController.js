const {prisma} = require('../config/db');

const listCategories= async (req, res)=>{
    const categorias= await prisma.category.findMany({orderBy:{name:"asc"}})

    res.status(200).json(categorias)
}


module.exports={listCategories}