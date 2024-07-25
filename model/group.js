const mongoose = require('mongoose')
const groupschema = mongoose.Schema({
    groupDiploma: String,
    groupName:String,
    groupStart:Date,
    groupCreatedAt:Date,
    groupCreatedBy:{_id:String,name:String},
    groupStudents:{type:Number,default:0},
    groupSessions:{type:Number,default:0},
    groupCurrentSession :{type:Number,default:0},
    updatedAt:Date,
    updatedBy:{_id:String,name:String}
})
const groupmodel = mongoose.model('Group',groupschema)
module.exports=groupmodel