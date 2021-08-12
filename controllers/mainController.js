//const express = require('express');
//const app = express();
//const bodyParser = require('body-parser');
//const session = require('express-session');
//const bCrypt = require('bCrypt');
const passport = require('passport');
const jwt = require("jsonwebtoken");
//const handlebars = require('express-handlebars');
// const tokenSecret = process.env.JWT_SECRET_KEY;
//const LocalStrategy = require('passport-local').Strategy;

require('dotenv').config();
/*
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
app.use(passport.initialize());
app.use(express.json())
app.use(passport.session()); */

//const userModel = require('../models/users');

    
/* -------------- routes -------------- */

// login

const logUser = async (req, res, next) => {
    passport.authenticate('login', async(err, user, info) => {
        try {
            if(err) {
                return next(err);
            }

            if(!user && info){
                return res.status(401).json({message: info.message});
            }

            req.logUser(
                user, 
                {session: false},
                async(error) => {
                    if(error){
                        return next(error);
                    }

                    const body = {_id: user._id, email: user.email};
                    const token = jwt.sign({user:body}, process.env.JWT_SECRET_KEY);

                    return res.json({token});
                }
            );
        } catch(error) {
            return next(error);
        }
    })(req, res, next);
}

const LoginOk = (req, res, next) => {
    if(req.isAuthenticated()){
        res.render("welcome", { user: user});
    }
    else {
        res.sendFile(process.cwd() + '/public/login.html')
    }
}

const LoginFail = (req, res, next) => {
    res.render('login-error', {});
}

const Logout = (req, res, next) => {
    let nombre = req.user.name;

    req.logout();
    res.render("logout", { nombre });
}

const Redirect = (req, res, next) => {
    res.redirect('/');
}

// register

const register = async(req, res, next) => {
    res.json({
        message: 'Registro exitoso',
        user: req.user
    });
}

const RegisterOk = (req, res, next) => {
    res.sendFile(process.cwd() + '/public/register.html');
}; 

const RegisterFail = (req, res) => {
    res.render('register-error', {});
}


module.exports = {
    logUser,
    register,
    RegisterOk,
    RegisterFail,
    LoginOk,
    LoginFail,
    Logout,
    Redirect
};

/*


    //logUser,
    //registerUser,
 -------------- hash password -------------- 

const createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

 -------------- check valid password -------------- 

const isValidPassword = function(user, password){        
    return bCrypt.compareSync(password, user.password);
} 

/* --------- email & sms config --------- */
// ethereal
//const ethereal = require('../email/ethereal');
//const twilio = require('./sms/twilio');

//const adminEmail = 'clovis.kris@ethereal.email';
//const adminNumber = process.env.WHATSAPP_NUMBER;


/* ----------------------- SERIALIZE & DESERIALIZE ----------------------- */

/*

passport.serializeUser(function(user, done) {
        done(null, user._id);
});

passport.deserializeUser(function(id, done) {
       userModel.findById(id, function(err, user) {
           done (err, user);
       });
});

*/


/* ----------------------- LOGIN ----------------------- */

/*
passport.use('login', new LocalStrategy({
    passReqToCallback: true
}, 
    function(username, password, done){
        userModel.findOne({username: username},
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
                if(!isValidPassword(user,password)) {
                    return res.status(401).json({
                        status: 401,
                        message: 'Contraseña incorrecta. Vuelva a intentarlo'
                    })
                }
            return done(null, user);
        });
    }
));

passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, 
    function(req, username, password, done){
        findOrCreateUser = function(){
            userModel.findOne({username: username}, function(err, user){
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
                    // si no existe, crear el usuario
                    const {name, address, admin, phoneNumber, passwordConfirm} = req.body;
                    const user = {
                        username,
                        password: createHash(password),
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
        });
    }
    process.nextTick(findOrCreateUser);
})
);

*/


/*
const logUser = (req, username, password, done) => {
    // chk en db si existe el username
    userModel.findOne({username: username},
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
            if(!isValidPassword(user,password)) {
                return res.status(401).json({
                    status: 401,
                    message: 'Contraseña incorrecta. Vuelva a intentarlo'
                })
            }

            // tout est OK

            /*
            const token = jwt.sign(
                {id: user._id},
                process.env.JWT_SECRET_KEY, 
                {expiresIn: process.env.TOKEN_KEEP_ALIVE},
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.json({
                        token, 
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.username,
                            admin: user.admin
                        }
                    });
                }
                
            ) */
            /*
            return done(null, user);
        }
    );
}

const registerUser = (req, username, password, done) => {
    findOrCreateUser = function(){
        userModel.findOne({'username':username}, function(err, user){
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
                // si no existe, crear el usuario
                const {name, address, admin, phoneNumber, passwordConfirm} = req.body;

                //const phoneInputField = phoneNumber;
                /* const phoneInput = window.intlTelInpute(phoneInputField, {
                    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                });
                const intPhoneNumber = phoneInput.getNumber(); */

                // validar que contraseñas ingresadas en el form sean igual

                //if (password === passwordConfirm) {
                    /*
                    const user = {
                        username,
                        password: createHash(password),
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
                /*} else {
                    return res.status(400).json({
                        status: 400,
                        message: 'Las contraseñas no coinciden'
                    })
                }*/
                /*
            }
        });
    }
    process.nextTick(findOrCreateUser);
}

*/

/*

const Order = (req, res) => {
    const {order} = req.body;

    let nombre = req.user.name;
    let email = req.user.username;
    let phoneNumber = req.user.phoneNumber;

    let asunto = `Nuevo pedido de ${nombre}: ${email}`;
    let mensaje = `Pedido: ${order}`;

    let bodyWhatsApp = `Nuevo pedido de ${nombre}: ${email}. Pedido: ${order}.`


    // ethereal 
    ethereal.enviarEthereal(adminEmail, asunto, mensaje);

    // whatsapp al admin
    twilio.enviarWhatsApp(adminNumber, bodyWhatsApp);

    // text al user
    twilio.enviarSMS(phoneNumber.toString(), 'Pedido recibido y en proceso');

    res.redirect('/');
}
*/