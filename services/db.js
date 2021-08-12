const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let isConnected;

const connectToDB = (databaseName = process.env.DB_NAME) => {
    
    if(isConnected) {
        console.log('Utilizando conexión existente a la BD');
        return Promise.resolve()
    }
    //else
    const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${encodeURIComponent(process.env.MONGO_PSW)}coderhouse.j2t64.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

    return mongoose.connect(uri, { 
        useNewUrlParser: true 
    }).then((db) => {
        isConnected = db.connections[0].readyState;
    }).catch( (err) => console.log(err) );

    
};

module.exports = {
    connectToDB
};