const mongoose =require('mongoose')
const userSessionSchema = mongoose.Schema({
   sessionId:String,
   userId:String,
   assignment:String,
   question:String,
   feedback:String,
   comment:String,
   attended:Boolean,
   updatedAt:Date,
   updatedBy:{_id:String,name:String}
})
const userSessionModel = mongoose.model('UserSession',userSessionSchema)
module.exports=userSessionModel