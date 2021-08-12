const express = require('express');
const app = express();

const passport = require('passport');
const bCrypt = require('bCrypt');
const session = require('express-session');
const handlebars = require('express-handlebars');
// const jwt = require("jsonwebtoken");

const enviarEthereal = require('../email/ethereal');

// const tokenSecret = process.env.JWT_SECRET_KEY;
const LocalStrategy = require('passport-local').Strategy;

require('dotenv').config();

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
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
})); 

const userModel = require('../models/users');
// const { FeedbackSummaryPage } = require('twilio/lib/rest/api/v2010/account/call/feedbackSummary');

/* -------------- hash password -------------- */

/*
const createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
} */

/* -------------- routes -------------- */

// REGISTRATION

const RegisterOk = (req, res) => {
    res.sendFile(process.cwd() + '/public/register.html');
}; 

const RegisterFail = (req, res) => {
    res.render('register-error', {});
}

const Redirect = (req, res) => {
    res.redirect('/');
}



module.exports = {
    RegisterOk,
    RegisterFail,
    Redirect
};

/* 
UPLOAD PIC??
avatar: {
    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
    contentType: 'image/png'
}
 -------------- upload files --------------


const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

let upload = multer ({storage: storage});

----------------------- LOGGERS -----------------------
log4js.configure({
    appenders: {
        miLoggerConsole: {type: "console"},
        miLoggerFileWarning: {type: 'file', filename: 'warn.log'},
        miLoggerFileError: {type: 'file', filename: 'error.log'}
    },
    categories: {
        default: {appenders: ["miLoggerConsole"], level:"trace"},
        info: {appenders: ["miLoggerConsole"], level: "info"},
        warn: {appenders:["miLoggerFileWarning"], level: "warn"},
        error: {appenders: ["miLoggerFileError"], level: "error"}
    }
});

const loggerInfo = log4js.getLogger('info');
const loggerWarn = log4js.getLogger('warn');
const loggerError = log4js.getLogger('error');

const logUser = (req, username, password, done) => {
    // chk en db si existe el username
    userModel.findOne({'username': username},
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
            const token = jwt.sign(
                {email: user.username, id: user._id, name: user.name},
                process.env.JWT_SECRET_KEY, 
                {expiresIn: process.env.TOKEN_KEEP_ALIVE}
            )
            
            return res.status(200).json({token});
        }
    );
}



const isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}


// LOGIN

const Login = (req, res) => {
    if(req.isAuthenticated()){
        res.render("welcome", {
            nombre: req.user.name
        })
    } else {
        res.sendFile(process.cwd() + '/public/login.html');
    }
    
}; 

const LoginFail = (req, res) => {
    res.render('login-error', {});
}

*/