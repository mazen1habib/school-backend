const mongoose=require('mongoose')
const sessionschema = mongoose.Schema({
    sessionDiploma:String,
    sessionGroup:String,
    sessionName:String,
    sessionCreatedAt:Date,
    sessionCreatedBy:{ _id:String,name:String},
    sessionMaterial:String,
    sessionAssignment:String,
    sessionQuestion:String,
    sessionAttendance:Array,
    updatedAt:Date,
    updatedBy:{_id:String,name:String}
})
const sessionmodel= mongoose.model('Session',sessionschema)
module.exports=sessionmodel