const express = require('express');
const app = express();
const passport = require('passport');
const router = express.Router();

const productsController = require('../controllers/productsController');
const auth = require('../middleware/auth');

// routes

router.get('/:id?', productsController.getProducts);

router.get('/cat/:categoria', productsController.getByCategory);

router.post('/', passport.authenticate('jwt', { session: false }), productsController.addProduct);

router.patch('/:id', passport.authenticate('jwt', { session: false }), productsController.updateProduct);

router.delete('/:id', passport.authenticate('jwt', { session: false }), productsController.deleteProduct);

module.exports = router;

// auth, 
