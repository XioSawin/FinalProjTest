const mongoose = require('mongoose');

const productosCollection = 'productos';

const ProductosSchema = new mongoose.Schema({
    nombre: {type: String, require: true, max: 100},
    descripcion: {type: String, require: true, max: 20},
    precio: {type: Number, require: true},
    foto: {type: String, require: true},
    categoria: {type: String, require: true, max: 10},
    stock: {type: Number, require: true}
})

module.exports = mongoose.model(productosCollection, ProductosSchema);
