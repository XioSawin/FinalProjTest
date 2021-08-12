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
    const userID = req.params.id;

    let cart = carritoModel.findOne({ userID: userID });

    if(cart && cart.items.length>0){
        res.send(cart);
    } else {
        res.send(null);
    }
};

const addProducto = (req, res, next) => {
    const userID = req.params.id;
    const {productID, cantidad, userEmail, direccion, } = req.body;

    let cart = carritoModel.findOne({ userID: userID });
    let product = productoModel.findOne({ _id: productID });

    if(!product) {
        res.status(400).send('Producto no encontrado');
    }

    const precio = product.precio;
    const nombre = product.nombre;

    if(cart) {
        // si existe la relación carrito-usuario
        let productIndex = cart.productos.findIndex( p=> p.productID == productID);

        // si existe producto en el carrito +1 - else, add 1.
        if(productIndex > -1){
            let productItem = cart.productos[productIndex];
            productItem.cantidad += cantidad;
            cart.productos[productItem] = productItem;
        } else {
            cart.productos.push({productID, nombre, cantidad, precio});
        }

        cart.total += cantidad*precio;
        cart = cart.save();

        return res.status(201).send(cart);
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

        return res.status(201).send(newCart);
    }
};


const deleteProducto = (req, res, next) => {
    const { userID, productID } = req.params;

    let cart = carritoModel.findOne({userID});
    let productIndex = cart.productos.findIndex(p => p.productID == productID);

    if(productIndex > -1) {
        // eliminar un producto del carrito del user.
        let productItem = cart.productos[productIndex];
        cart.total -= productItem.cantidad * productItem.precio;
        cart.productos.splice(productIndex, 1);
    }

    cart = cart.save();
    return res.status(201).send(cart);
}

module.exports = {
    getCarrito,
    addProducto,
    deleteProducto
};



