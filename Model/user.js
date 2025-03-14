const mongoose = require('mongoose');

const user = mongoose.Schema({
_id :{
        type : String ,
        default:()=>new mongoose.Types.ObjectId().toHexString(),
        required: true
    },
    email :{type: String, required: true},
    password: {type: String, required: false},
    name: {type: String, required: false},
    phone: {type: String, required: false},
    date: {type: String, required: false},
    address: {type: String, required: false},
    avatar: {type: String, default: ''},
    role: { type: String, required: true, default: 'user' },
    created_at: { type: Date, default: Date.now }
})

const users = mongoose.model('users', user);

module.exports = users;