const express = require('express');
const handlebars = require('express-handlebars');
require('../middleware/auth');

const mainRoutes = require('../routes/index');
const app = express();

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
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/api', mainRoutes);
//app.use('/', mainRoutes);

module.exports = app;