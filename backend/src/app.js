const express= require('express');
const cors= require('cors')
require('dotenv').config();

const {connectDB} = require('./config/db')
const app = express()

const providerRoutes = require('./routes/providerRoutes')
const categoryRoutes = require('./routes/categoryRoutes')

app.use(cors());
app.use(express.json());



app.get('/health', (req,res)=>{
    res.json({message:"Ok"})
})

app.use('/proveedores',providerRoutes)
app.use('/categorias', categoryRoutes)

app.get('/boom', (req, res) => {
    throw new Error('prueba')
})

app.use((req,res)=>{
    res.status(404).json({error: "Pagina no encontrada"})
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: "Error interno del servidor" })
})

const PORT=process.env.PORT || 3000;

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Servidor en http://localhost:${PORT}`)
    })
})



