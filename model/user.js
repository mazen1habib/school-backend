const mongoose = require('mongoose')
const usershema = mongoose.Schema({
    userName: String,
    email:String,
    password:String,
    phone:String,
    role:String,
    diploma:String,
    group:String,
    userCreatedAt:Date,
    userCreatedBy:{_id:String,name:String},
    updatedPasswordBy:{_id:String,name:String},
    updatedAt:Date,
    updatedBy:{_id:String,name:String}
})
const usermodel = mongoose.model('User',usershema)
module.exports = usermodel