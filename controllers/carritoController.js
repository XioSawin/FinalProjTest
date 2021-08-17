const express = require('express');
const app = express();

const carritoModel = require('../models/carritos');
const productoModel = require('../models/productos');

app.use(express.json())

const getTimestamp = () => {
    let date = new Date();

    let d = date.getDate();
    let mo = date.getMonth() + 1;
    let y = date.getFullYear();
    let h = date.getHours();
    let mi = date.getMinutes();
    let s = date.getSeconds();

    let today = d + '/' + mo + '/' + y + ' ' + h + ':' + mi + ':' + s;

    return today;
};

const getCarrito = (req, res, next) =>{
    const { userID } = req.params;

    //carritoModel.findById
    //console.log(userID);

    carritoModel.findOne( {userID: userID} )
            .then((cart) => res.send(cart))
            .catch((err) => res.send(err))

    /*
    let cart = await carritoModel.findOne({ userID: userID });

    if(cart && cart.items.length>0){
        return res.sendStatus(201).send(newCart)
    } else {
        return res.send(null);
    }
    */
};

const addProducto = async (req, res, next) => {
    
    const { userID, productID, cantidad, userEmail, direccion } = req.body;

    console.log("------DATOS PASADOS EN EL BODY------");
    console.log(userID);
    console.log(productID);

    // por alguna razón devuelven info sobre la collection, y no el carrito/producto a ingresar
    // el status es 500: INTERNAL SERVER ERROR.
    let cart = await carritoModel.findOne({ userID: userID });
    let product = await productoModel.findOne({_id: productID});

    //console.log("------CART QUERY------");
    // console.log(cart);
    //console.log("------PRODUCTO QUERY------");
    // console.log(product);

    if(!product) {
        res.status(400).send('Producto no encontrado');
    }

    let precio = product.precio;
    console.log(precio)
    let nombre = product.nombre;

    if(cart) {
        // si existe la relación carrito-usuario
        let productIndex = cart.productos.indexOf( p=> p.productID == productID);

        console.log(productIndex);
        // si existe producto en el carrito +1 - else, add 1.
        if(productIndex > -1){
            let productItem = cart.productos[productIndex];
            productItem.cantidad += cantidad;
            cart.productos[productItem] = productItem;
        } else {
            cart.productos.push({productID, nombre, cantidad, precio});
        }

        cart.total += cantidad*precio;

        let savedCart = await cart.save()
        /*
        cart.save()
            .then( () => res.sendStatus(201).send(newCart) )
            .catch( (err) => res.status(400).json({
                status: 400,
                message: err
            })) */

        return res.status(201).send(savedCart);
    } else {
        // si no existe carrito para el usuario activo.
        const newCart = new carritoModel({
            userEmail,
            userID,
            productos: [{productID, nombre, cantidad, precio}],
            direccion,
            total: cantidad*precio, 
            timestamp: getTimestamp()
        });

        console.log(newCart);

        let newSavedCart = newCart.save();

        /*
        newCart.save()
            .then( () => res.sendStatus(201).send(newCart) )
            .catch( (err) => res.status(400).json({
                status: 400,
                message: err
            }))
            */
        return res.status(201).send(newSavedCart);
        
    }
};


const deleteProducto = async(req, res, next) => {
    const { productID } = req.params;
    const { userID } = req.body;

    let cart = await carritoModel.findOne({ userID : userID });
    let productIndex = await cart.productos.findIndex(p => p.productID == productID);

    if(productIndex > -1) {
        let productItem = cart.productos[productIndex];

        if (productItem.cantidad == 1){
            //si ya hay uno solo, elimino el producto entero
            cart.total -= productItem.precio;
            cart.productos.splice(productIndex, 1);
        }

        //si hay la cantidad del producto > 1, actualizo la cantidad y el total en el carrito.
        productItem.cantidad -= 1;
        cart.total -= productItem.cantidad * productItem.precio;
    } 

    let savedCart = await cart.save();
    return res.status(201).send(savedCart);
}

module.exports = {
    getCarrito,
    addProducto,
    deleteProducto
};



