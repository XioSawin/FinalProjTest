const express = require('express');
const app = express();
const ordenModel = require('../models/ordenes');
const carritoModel = require('../models/carritos');
const userModel = require('../models/users');
const sendEmail = require('../email/ethereal');

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

const getOrden = (req, res, next) => {
    const { numOrden } = req.params;

    if(numOrden) {
        ordenModel.find({numOrden})
            .then((orders) => res.json(orders))
            .catch((err) => res.send(err));
    } else {
        res.status(500).send("No se encontró el número de orden.")
    }
};

const getOrdenesByID = (req, res, next) => {
    const { userID } = req.params;

    if(userID) {
        ordenModel.find({userID})
        .then(orders => res.json(orders));
    } else {
        res.status(500).send("No se encontraron ordenes con el userID ingresado..")
    }
};

const checkout = async (req, res, next) => {
    const {userID} = req.params;

    let cart = await carritoModel.findOne({userID});
    let user = await userModel.findOne({_id: userID});

    const email = user.username;

    let numOrden = ordenModel.countDocuments({}) + 1;
    console.log(numOrden);

    if(cart){
        const order = new ordenModel({
            userEmail: email,
            numOrden,
            productos: cart.productos,
            estado: 'generado',
            userID,
            timestamp: getTimestamp(),
            total: cart.total
        })

        console.log(order);

        const data = await carritoModel.findByIdAndDelete({_id: cart.id});
        sendEmail.enviarEthereal(process.env.EMAIL_ADMIN, `Nueva order - user ID: ${userID}`, JSON.stringify(order));
        sendEmail.enviarEthereal(email, `¡Gracias por tu orden ${user.name}! - Te enviamos el detalle`, JSON.stringify(order));

        return res.status(201).send(order);
    }

};

const complete = (req, res, next) => {
    const { numOrden } = req.params;

    if(numOrden) {
        ordenModel.updateOne({numOrden}, {
            $set: {estado: 'completado'}
        })
            .then((updatedOrder) => res.send(updatedOrder))
            .catch((err) => res.send(err));
        
    } else {
        res.status(500).send("No se encontró el número de orden.")
    }
};

module.exports = {
    getOrden,
    getOrdenesByID,
    checkout,
    complete
};