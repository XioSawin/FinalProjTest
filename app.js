const mongoose = require('mongoose');
const handlebars = require('express-handlebars');

require('dotenv').config();

const app = require('./services/server');
const http = require('http').createServer(app)
const socketIO = require('socket.io')(http);

const mensajes = require('./routes/mensajesRoutes.js');


/* ----------------------- CHAT ----------------------- */
const messagesModel = require('./models/mensajes');

const getMessages = () => {
    const messages = messagesModel.find({ }); // por alguna razón devuelve toda la query y no el documento?

    return messages;
}

socketIO.on('connection', (socket)=>{
    const myMessages = getMessages();
    console.log(myMessages);
    socket.emit('messages', myMessages);

    socket.on('new-message', function(data) {

        console.log(data);

        const messageSaved = new messagesModel({
            userEmail: data.userEmail,
            tipo: data.tipo,
            timestamp: data.timestamp,
            message: data.message
        });

        console.log(messageSaved);

        messageSaved.save()
            .then( () => res.sendStatus(201) )
            .catch( (err) => res.status(400).json({
                status: 400,
                message: 'Error guardando mensaje en base de datos'
            }));
        
        io.sockets.emit('messages', getMessages());
    })
})


http.listen( process.env.PORT|| process.env.DEV_PORT, ()=>{
    mongoose.connect(process.env.DB_CONN, 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }
    )
        .then( () => console.log('Base de datos conectada') )
        .catch( (err) => console.log(err) );
    console.log(`Running on PORT ${process.env.DEV_PORT} - PID WORKER ${process.pid}`);
        
});
