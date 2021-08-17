const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bCrypt = require('bcrypt');
const userModel = require('../models/users');
const sendEmail = require('../email/ethereal');
const cookieParser = require('cookie-parser');
//const jwt = require('jsonwebtoken');

// require('dotenv').config();

const strategyOptions = {
    usernameField: 'username',
    passwordField: 'password', 
    passReqToCallback: true,
}

const strategyJWT = {
    secretOrKey: process.env.JWT_SECRET_KEY,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

/*--------------*/


const register = (req, username, password, done) => {

        try{
            userModel.findOne({username: username}, function(err, user){
                console.log(username);
                if(err){
                    console.log(err);
                    return done(err);
                }
                // si user ya existe
                if (user) {
                    console.log('User already exists')
                    return done(null, false);
                } else {
                    const {name, address, passwordConfirm, phoneNumber} = req.body;
    
                    if(passwordConfirm === password){
                        const user = {
                            username,
                            password,
                            name, 
                            address,
                            phoneNumber: phoneNumber,
                            admin: "user"
                        }
                        const newUser = new userModel(user);
        
                        newUser.save()
                            .then(() => res.send('Registro exitoso'))
                            .catch((error) => ('Error en el regisro: ' + error))
                        
                        sendEmail.enviarEthereal(process.env.EMAIL_ADMIN, "Nuevo Registro", JSON.stringify(newUser));
    
                        return done(null, newUser);
                    } else {
                        console.log('Las contraseñas no coinciden. Vuelva a intentarlo.')
                        return done(null, false);
                    }
                }
            })
        } catch(error) {
            console.log(error);
            return done(error);
        }
}

const login = async(req, username, password, done) => {
    try{
        userModel.findOne({username: username},
            function(err, user) {
                console.log('----USER FOUND----');
                console.log(user);
                // if there is an error
                if(err) {
                    console.log(err);
                    return done(null, false);
                    /*
                    return res.status(400).json({
                        status: 400,
                        message: err,
                    });*/
                }
    
                // if username does not exist on db
                if(!user) {
                    console.log('Email incorrecto. Vuelva a intentarlo')
                    return done(null, false);
                    /*
                    return res.status(401).json({
                        status: 401,
                        message: 'Email incorrecto. Vuelva a intentarlo'
                    })*/
                }
    
                // if right user but wrong pwrd
                const validate = isValidPassword(user, password);
                console.log('----IS PWRD VALID?----');
                console.log(validate);

                if(!validate) {
                    console.log('Email incorrecto. Vuelva a intentarlo')
                    return done(null, false);
                }
                console.log('----USER FOUND----');
                console.log(user);
                // tout est OK
                return done(null, user);
            }
        );
    } catch(error) {
        console.log(error);
        return done(error);
    }
}

const isValidPassword = function(user, password){        
    return bCrypt.compareSync(password, user.password);
} 

/*--------------*/
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}));

app.use(passport.initialize());
app.use(passport.session());



/*--------------*/

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    userModel.findById(id).then(user => {
        console.log(user);
        done(err, user);
    })
});

/*--------------*/

// middleware

passport.use('register', new localStrategy(strategyOptions, register));
passport.use('login', new localStrategy(strategyOptions, login));


passport.use(
    new JWTstrategy(strategyJWT, async (token, done) => {
        console.log('----JWT STRATEGY----');
        console.log(token);
        try{
            return done(null, token.user);
        } catch(error){
            done(error);
        }
    })
);

