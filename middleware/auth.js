const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const userModel = require('../models/users');
const enviarEthereal = require('../email/ethereal');
//const jwt = require('jsonwebtoken');

// require('dotenv').config();

const strategyOptions = {
    usernameField: 'email',
    passwordField: 'password'
}

const strategyJWT = {
    secretOrKey: process.env.JWT_SECRET_KEY,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

const register = async(req, email, password, done) => {
    try{
        userModel.findOne({username: email}, function(err, user){
            console.log(username);
            if(err){
                console.log(err);
                return res.status(400).json({
                    status: 400,
                    message: err,
                });
            }
            // si user ya existe
            if (user) {
                console.log('User already exists')
                return res.status(400).json({
                    status: 400,
                    message: 'Usuario ya existe. Ingrese un nuevo usuario.',
                });
            } else {
                const {name, address, admin, phoneNumber} = req.body;
                    const user = {
                        username: email,
                        password,
                        name, 
                        address,
                        phoneNumber: phoneNumber,
                        admin
                    }
                    const newUser = new userModel(user);
    
                    newUser.save()
                        .then(() => res.send('Registro exitoso'))
                        .catch((error) => ('Error en el regisro: ' + error))
                    
                    enviarEthereal(process.env.EMAIL_ADMIN, "Nuevo Registro", JSON.stringify(newUser));

                    return done(null, newUser);
            }
        })
    } catch(error) {
        console.log(error);
        return done(error);
    }
}

const logUser = async(email, password, done) => {
    try{
        userModel.findOne({username: email},
            function(err, user) {
                // if there is an error
                if(err) {
                    return res.status(400).json({
                        status: 400,
                        message: err,
                    });
                }
    
                // if username does not exist on db
                if(!user) {
                    return res.status(401).json({
                        status: 401,
                        message: 'Email incorrecto. Vuelva a intentarlo'
                    })
                }
    
                // if right user but wrong pwrd
                const validate = isValidPassword(user, password);

                if(!validate) {
                    return res.status(401).json({
                        status: 401,
                        message: 'Contraseña incorrecta. Vuelva a intentarlo'
                    })
                }
    
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

// middleware

passport.use('register', new localStrategy(strategyOptions, register));
passport.use('login', new localStrategy(strategyOptions, logUser));


passport.use(
    new JWTstrategy(strategyJWT, async (token, done) => {
        try{
            return done(null, token.user);
        } catch(error){
            done(error);
        }
    })
);

