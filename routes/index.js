const express = require('express');
const passport = require('passport');

const router = express.Router();
const main = require('./routes/mainRoutes.js');
const productos = require('./routes/productosRoutes.js');
const orders = require('./routes/ordenRoutes.js');
const cart = require('./routes/carritoRoutes.js');
const mensajes = require('./routes/mensajesRoutes.js');

router.use('/', main);
router.use('/products', passport.authenticate('jwt', {session: false}), productos);
router.use('/orders', passport.authenticate('jwt', {session: false}), orders);
router.use('/cart', passport.authenticate('jwt', {session: false}), cart);
router.use('/chat', passport.authenticate('jwt', {session: false}), mensajes);

router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({error: err});
});

module.exports = router;