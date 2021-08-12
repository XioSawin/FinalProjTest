const mongoose = require('mongoose');

require('dotenv').config();
const connectToDB = require('./services/db');
const app = require('./services/server');
const socketIO = require('socket.io')
const http = require('http').Server(app)


/* ----------------------- SERVER + DB CONNECTION ----------------------- */


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
        
})
