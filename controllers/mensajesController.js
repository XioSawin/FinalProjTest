const express = require('express');
const app = express();

const handlebars = require('express-handlebars');

app.use(express.json())

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

/* ----------------------- CHAT W/ WEBSOCKETS ----------------------- */

const messagesModel = require('../models/mensajes');

const getChat = async(req, res) => {
    res.render("chat", {});
}

const getMsgByEmail = async(req, res) =>  {
    const {email} = req.params;

    messagesModel.find({userEmail: email})
        .then((messages) => res.send(messages))
        .catch((err) => res.sendStatus(err))
}

module.exports = {
    getChat,
    getMsgByEmail
};
