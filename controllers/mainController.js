const passport = require('passport');
const jwt = require("jsonwebtoken");

require('dotenv').config();


    
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

