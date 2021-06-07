const mongoose = require('mongoose');

const usersCollection = 'users';

/* -------------- SCHEMA -------------- */
const UserSchema = mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model(usersCollection, UserSchema);