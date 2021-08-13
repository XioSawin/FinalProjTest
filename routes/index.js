const express = require('express');
const passport = require('passport');

const router = express.Router();
const main = require('./mainRoutes.js');
const productos = require('./productosRoutes.js');
const orders = require('./ordenRoutes.js');
const cart = require('./carritoRoutes.js');
const mensajes = require('./mensajesRoutes.js');

router.use('/auth', main);
router.use('/products', productos);
router.use('/orders', orders);
router.use('/cart', cart);
router.use('/chat', mensajes);

router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({error: err});
});

module.exports = router;

// passport.authenticate('jwt', {session: false}),