const { Router } = require("express");
const carritoController = require("../controllers/carritoController");

const router = Router();

router.get('/cart/:id', carritoController.getCarrito);
router.post('/cart', carritoController.addProducto);
router.delete('/cart/:userID/:productID', carritoController.deleteProducto);



module.exports = router;
