const mongoose = require('mongoose');
const bCrypt = require('bcrypt');

const usersCollection = 'users';

/* -------------- SCHEMA -------------- */
const UserSchema = new mongoose.Schema({
    username: {type: String, require: true, max: 100},
    password: {type: String, require: true, max: 30},
    name: {type: String, require: true, max: 100},
    address: {type: String, require: true, max: 50},
    phoneNumber: {type: String, require: true, max: 20},
    admin: {type: String, default: false}
});

UserSchema.pre(
    'save',
    async function(next){
        const user = this;
        const hash = await bCrypt.hash(user.password, 10);

        this.password = hash;
        next()
    }
)

UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bCrypt.compate(password, user.password);
    return compare;
}

module.exports = mongoose.model(usersCollection, UserSchema);