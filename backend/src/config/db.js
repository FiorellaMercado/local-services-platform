const {PrismaClient} = require('@prisma/client');
const {PrismaPg} = require('@prisma/adapter-pg')

const adapter = new PrismaPg({connectionString:  process.env.DATABASE_URL})
const prisma= new PrismaClient({adapter});


async function connectDB() {

    try{
        await prisma.$connect();
        console.log("Bases de datos conectada")

    }catch(error){
        console.error("Error ", error);
        process.exit(1)
    }
    
}

module.exports={connectDB, prisma}