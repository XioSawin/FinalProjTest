const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())
const mensajesController = require('../controllers/mensajesController');

router.get('/', mensajesController.getChat);

router.get('/:email', mensajesController.getMsgByEmail);

//router.post('/:email', mensajesController.postMessage);

//router.patch('/:id', auth, productsController.updateProduct);

//router.delete('/:id', auth, productsController.deleteProduct);

module.exports = router;
