const { Router } = require("express");
const carritoController = require("../controllers/carritoController");

const router = Router();

router.get('/:userID', carritoController.getCarrito);
router.post('/', carritoController.addProducto);
router.delete('/:productID', carritoController.deleteProducto);



module.exports = router;

