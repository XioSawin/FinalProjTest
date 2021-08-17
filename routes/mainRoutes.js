const express = require('express');
const passport = require('passport');
const router = express.Router();

const mainController = require('../controllers/mainController');


/* -------------- routes -------------- */

// login
router.get('/login', mainController.LoginOk);

router.post('/login', passport.authenticate('login', {session: false , failureRedirect: '/faillogin'}),  mainController.Redirect); // ,  mainController.Redirect

router.get('/faillogin', mainController.LoginFail);

router.get('/logout', mainController.Logout);

// register
router.get('/register', mainController.RegisterOk);

router.post('/register', passport.authenticate('register', {session: false , failureRedirect: '/failregister'}),  mainController.Redirect); // ,  mainController.Redirect

router.get('/failregister', mainController.RegisterFail);

module.exports = router;

