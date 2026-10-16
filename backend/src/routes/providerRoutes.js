const express = require('express')
const router = express.Router()
const provider =  require('../controllers/providerController');

router.get('/',provider.listProviders)

router.get('/:id', provider.providerById)


module.exports=router;