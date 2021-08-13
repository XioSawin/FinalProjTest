// import clase producto

const { Router } = require("express");
const carritoController = require("../controllers/carritoController");

const router = Router();

router.get('/:userID', carritoController.getCarrito);
router.post('/', carritoController.addProducto);
//router.post('/cart/submit', carritoController.submitCarrito);
router.delete('/:productID', carritoController.deleteProducto);



module.exports = router;

