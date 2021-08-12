// import clase producto

const { Router } = require("express");
const carritoController = require("../controllers/carritoController");

const router = Router();

router.get('/cart/:id', carritoController.getCarrito);
router.post('/cart', carritoController.addProducto);
//router.post('/cart/submit', carritoController.submitCarrito);
router.delete('/cart/:userID/:productID', carritoController.deleteProducto);



module.exports = router;


/*
// productList

const productList = productos.productList;

// Productos en carrito

const cart = [];

function getTimestamp(){
    let date = new Date();

    let d = date.getDate();
    let mo = date.getMonth() + 1;
    let y = date.getFullYear();
    let h = date.getHours();
    let mi = date.getMinutes();
    let s = date.getSeconds();

    let today = d + '/' + mo + '/' + y + ' ' + h + ':' + mi + ':' + s;

    return today;
}

// Routes

router.get('/listar/:id?', (req, res)=>{ // get info by id if given - listar productos
    const { id } = req.params;
    if(id){

        const carrito = cart.find(carrito => carrito.id == id);

        if(!carrito){ 
            res.json({error: 'producto no encontrado'});
        }

        res.json(carrito);
    }
    
    res.json(cart);
})

router.post('/agregar/:id_producto', (req, res) => { // add product to cart

    const { id_producto } = req.params;
    console.log(productList);

    const producto = productList.find(producto => producto.id == id_producto);
    console.log(producto);

    let idCart = (cart.length)+1;

    let today = getTimestamp();

    const item = {
        id: idCart,
        today,
        producto
    }

    cart.push(item);
    res.sendStatus(201);
})

router.delete('/borrar/:id', (req, res) => { // borrar producto x id

    const { id } = req.params;

    const item = cart.find(item => item.id == id);

    if(!item){ 
        res.sendStatus(404);
    }

    cart = cart.filter((item) => item.id != id)
})

*/

