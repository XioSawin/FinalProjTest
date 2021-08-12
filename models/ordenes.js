const mongoose = require('mongoose');

const ordenesCollection = 'ordenes';

const OrdenesSchema = new mongoose.Schema({
    userEmail: {type: String, require: true, max: 50},
    numOrden: {type: Number, require: true },
    productos: [{
        productID: {type: String,},
        nombre: String,
        cantidad: {type: Number, required: true, default: 1},
        precio: Number
    }],
    estado: {type: String, require: true},
    userID: {type: String, require: true},
    timestamp: {type: String, require: true},
    total: {type: Number, require: true}
})

module.exports = mongoose.model(ordenesCollection, OrdenesSchema);