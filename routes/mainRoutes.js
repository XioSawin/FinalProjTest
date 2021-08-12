const express = require('express');
//const app = express();
const passport = require('passport');
//const jwt = require('jsonwebtoken');

//const handlebars = require('express-handlebars');
const router = express.Router();

const mainController = require('../controllers/mainController');
//const userModel = require('../models/users');

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
//app.use(passport.initialize());
//app.use(passport.session());

*/



/* ----------------------- SERIALIZE & DESERIALIZE ----------------------- */

/*
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done (err, user);
});
*/


/* ----------------------- LOGIN ----------------------- */

/*
// login
passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done) {
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
    
                
                
                return done(null, user);
            }
        );
        }
    )
);

// register

passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, function(req, username, password, done) {
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
    }
)
);

*/

/* -------------- routes -------------- */

// login
router.get('/login', mainController.LoginOk);

router.post('/login', mainController.logUser);

router.get('/faillogin', mainController.LoginFail);

router.get('/logout', mainController.Logout);

// register
router.get('/register', mainController.RegisterOk);

router.post('/register', passport.authenticate('register', {session: false }), mainController.register);

router.get('/failregister', mainController.RegisterFail);

module.exports = router;


/*

-------------- local strategy -------------- 

passport.use('login', new LocalStrategy({
    passReqToCallback: true
}, 
    mainController.logUser
));


passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, 
    mainController.registerUser
));

*/

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