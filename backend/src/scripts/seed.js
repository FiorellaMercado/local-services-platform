require('dotenv').config();
const {prisma} = require('../config/db')
const fs = require('fs/promises')
const path = require('path')


async function create_initial_data() {

    try{
        
        const categoriesPath=path.join(__dirname,'../static/json/categories.json')
        const providersPath=path.join(__dirname,'../static/json/providers.json')

        const df_categories=JSON.parse( await fs.readFile(categoriesPath, 'utf-8'))
        const df_providers= JSON.parse(await fs.readFile(providersPath,'utf-8'))

        await prisma.$transaction(async (tx)=>{
            await tx.review.deleteMany();
            await tx.provider.deleteMany();
            await tx.category.deleteMany();

            for( const data of df_categories){
                await tx.category.create({data: data})
            }
            console.log('categorias creadas')

            for (const data of df_providers) {
                const categoria= await tx.category.findUnique({where:{slug:data['categorySlug']}})
                if (!categoria){
                    throw new Error(`Error al cargar al proveedor: ${data['name']} de categoria ${data['categorySlug']}`);
                }
                data['categoryId']=categoria.id
                delete data.categorySlug
                await tx.provider.create({data: data})
            }
            console.log('Proveedores creado')
        }, { timeout: 30000 });
        
    }catch(error){
        console.error('El error: ', error)
        process.exitCode=1
    }finally{
        await prisma.$disconnect();
    }


}

create_initial_data()