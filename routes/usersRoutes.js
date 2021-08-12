const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bCrypt = require('bCrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const enviarEthereal = require('../email/ethereal');
const usersController = require('../controllers/usersControllers');
const userModel = require('../models/users');

const router = express.Router();



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
app.use(passport.session());


/* ----------------------- SERIALIZE & DESERIALIZE ----------------------- */

/* ----------------------- SERIALIZE & DESERIALIZE ----------------------- */
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


/* ----------------------- REGISTRATION ----------------------- */

/* -------------- local strategy -------------- */

passport.use('register', new LocalStrategy({
    passReqToCallback: true
},
    function(req, username, password, done){
        const findOrCreateUser = function(){
            userModel.findOne({username: username}, function(err, user){
                if(err){
                    return res.status(400).json({
                        status: 400,
                        message: err,
                    });
                }
                // si user ya existe
                if (user) {
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
    
                    if (password === passwordConfirm) {
    
                        if(admin.toUpperCase() == "ADMIN"){
                            admin = true
                        } else {
                            admin = false
                        }
    
                        const user = {
                            username,
                            password: createHash(password),
                            name, 
                            address,
                            phoneNumber: phoneNumber,
                            admin
                        }
                        const newUser = new userModel(user);
        
                        newUser.save(function(err) {
                            if(err) {
                                console.log(`Error guardando el usuario: "${err}"`);
                                throw err;
                            }
                            console.log('Usuario registrado con exito');
                            return done(null, newUser);
                        });
                        /*
                            .then(usuario => {
                                jwt.sign( 
                                    { id: usuario._id },
                                    process.env.JWT_SECRET_KEY,
                                    { expiresIn: process.env.TOKEN_KEEP_ALIVE },
                                    (err, token) => {
                                        if (err) {
                                            throw err;
                                        }
                                        res.json({
                                            token, 
                                            usuario: {
                                                id: user._id,
                                                name: user.name,
                                                email: user.username,
                                                admin: user.admin
                                            }
                                        });
                                    }
                                )
                            });
                        */
    
                            
                        enviarEthereal(process.env.EMAIL_ADMIN, "Nuevo Registro", JSON.stringify(newUser));
                    } else {
                        return res.status(400).json({
                            status: 400,
                            message: 'Las contraseñas no coinciden'
                        })
                    }
                    
                }
            });
        }
        process.nextTick(findOrCreateUser);
    }
)
);

/* -------------- hash password -------------- */

const createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

/* -------------- routes -------------- */

router.get('/register', usersController.RegisterOk);

router.post('/register', passport.authenticate('register', {failureRedirect: '/failregister'}), usersController.Redirect);

router.get('/failregister', usersController.RegisterFail);


module.exports = router;

