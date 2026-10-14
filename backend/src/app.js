const express= require('express');
const cors= require('cors')
require('dotenv').config();

const app = express()

app.use(cors());
app.use(express.json());



app.get('/health', (req,res)=>{
    res.json({message:"Ok"})
})

const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor en http://localhost:${PORT}`)
})


