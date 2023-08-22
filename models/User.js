const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    profileImage: {
        type: String,
        require: false
    },
    images: {
        type: String,
        require: false
    },
},
    {timestamps: true}
    )

const User = new mongoose.model('users', user)

module.exports = User;