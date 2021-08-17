const express = require('express');
//const { UserBindingContext } = require('twilio/lib/rest/chat/v2/service/user/userBinding');
const app = express();

const handlebars = require('express-handlebars');
const auth = require('../middleware/auth');

app.engine(
    "hbs", 
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static('public'));
app.use(express.json())

const productModel = require('../models/productos');

// testing adming true
// const administrador = true; 

// obtener lista de productos all o por categoria
const getProducts = (req, res, next) => {
    const { id } = req.params;

    if(id){
        productModel.findOne( {_id: id} )
            .then((producto) => res.send(producto))
            .catch((err) => res.send(err))
    }

    productModel.find( {} ).lean()
        .then((productos) => res.render("products", {productos}))
        .catch((err) => res.send(err))
}

const getByCategory = (req, res, next) => {
    const { categoria } = req.params;

    productModel.find( {categoria: categoria} )
        .then((producto) => res.send(producto))
        .catch((err) => res.send(err))
}

// add producto solo si se es admin
const addProduct = (req, res, next) => {
    
    /*

    const isAdmin = req.user.admin;
    console.log(isAdmin)
    if (isAdmin != "admin"){
        res.json({error: -1, descripcion: "ruta no autorizada"});
    } */

    const {nombre, descripcion, precio, foto, categoria, stock} = req.body;

    const productSaved = new productModel({nombre, descripcion, categoria, foto, precio, stock});

    console.log(productSaved);

    productSaved.save()
        .then( () => res.sendStatus(201) )
        .catch( (err) => res.status(400).json({
            status: 400,
            message: err
        }))
}

// actualizar producto por ID

const updateProduct = (req, res, next) =>{
    /*

    const isAdmin = req.user.admin;
    console.log(isAdmin)
    if (isAdmin != "admin"){
        res.json({error: -1, descripcion: "ruta no autorizada"});
    } */

    const { id } = req.params;

    const {nombre, descripcion, precio, foto, categoria, stock} = req.body;   
    
    productModel.updateOne({_id: id}, {
        $set: {nombre: nombre, descripcion: descripcion, precio: precio, foto: foto, categoria: categoria, stock: stock}
    })
        .then((updatedProduct) => res.send(updatedProduct))
        .catch((err) => res.send(err))

}

// eliminar producto por ID

const deleteProduct = (req, res, next) => {
    /*

    const isAdmin = req.user.admin;
    console.log(isAdmin)
    if (isAdmin != "admin"){
        res.json({error: -1, descripcion: "ruta no autorizada"});
    } */
    
    const { id } = req.params;

    productModel.deleteOne( {_id: id} )
        .then(() => res.sendStatus(200))
        .catch( (err) => res.status(404).json({
            status: 404,
            message: 'ID no fue encontrado. No se pudo eliminar el producto.'
        }))
}


module.exports = {
    getProducts,
    getByCategory,
    addProduct,
    updateProduct, 
    deleteProduct
}