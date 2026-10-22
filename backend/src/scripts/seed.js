require('dotenv').config();
const {prisma} = require('../config/db')
const fs = require('fs/promises')
const path = require('path')

const dbHost = new URL(process.env.DATABASE_URL).hostname;
const isLocal = ['localhost', '127.0.0.1'].includes(dbHost);

// guard para evitar borrar mi bd remota
if (!isLocal && !process.argv.includes('--force')) {
    throw new Error(
        `El seed borrara TODOS los datos y la base es remota (${dbHost}). ` +
        `Si quieres borrarlos ejecuta: npm run seed -- --force`
    );
}

//cargar datos iniciales
async function create_initial_data() {

    try{
        //traer los datos del json
        const categoriesPath=path.join(__dirname,'../static/json/categories.json')
        const providersPath=path.join(__dirname,'../static/json/providers.json')

        const df_categories=JSON.parse( await fs.readFile(categoriesPath, 'utf-8'))
        const df_providers= JSON.parse(await fs.readFile(providersPath,'utf-8'))

        await prisma.$transaction(async (tx)=>{
            await tx.review.deleteMany(); //borrar por si ya existe para evitar duplicacion o conflictos
            await tx.provider.deleteMany();
            await tx.category.deleteMany();
            //por cada linea del json crear un registro en categoria
            for( const data of df_categories){
                await tx.category.create({data: data})
            }
            console.log('categorias creadas')
            // lo mismo por proveedor
            for (const data of df_providers) {
                const categoria= await tx.category.findUnique({where:{slug:data['categorySlug']}}) //buscar el id de categoria por el slug
                if (!categoria){
                    throw new Error(`Error al cargar al proveedor: ${data['name']} de categoria ${data['categorySlug']}`);
                }
                data['categoryId']=categoria.id
                delete data.categorySlug //reemplazar el slug por el id para luego insertarlo
                await tx.provider.create({data: data})
            }
            console.log('Proveedores creado')
        }, { timeout: 30000 });
        
    }catch(error){
        console.error('El error: ', error)
        process.exitCode=1 //permite terminar lo que queda de tarea pero muestra el error al final
    }finally{
        await prisma.$disconnect();
    }


}

create_initial_data()