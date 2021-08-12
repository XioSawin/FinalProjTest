const mongoose = require('mongoose');

const mensajesCollection = 'mensajes';

const MensajesSchema = new mongoose.Schema({
    userEmail: {type: String, require: true, max: 50},
    tipo: {type: String, require: true, max: 20},
    timestamp: {type: String, require: true},
    mensaje: {type: String, require: true}
})

module.exports = mongoose.model(mensajesCollection, MensajesSchema);
