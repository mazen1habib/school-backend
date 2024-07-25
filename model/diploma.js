const mongoose = require('mongoose')
const diplomaschema = mongoose.Schema({
    diplomaName:{type:String,requireed:true},
    price:{type:Number,required:true},
    diplomaCreatedAt:Date,
    diplomaCreatedBy:{_id:String,name:String},
    updatedAt:Date,
    updatedBy:{_id:String,name:String}
})
const diplomamodel = mongoose.model('Diploma',diplomaschema)
module.exports= diplomamodel