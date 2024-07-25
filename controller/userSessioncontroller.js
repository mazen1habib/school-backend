const userSession = require('../model/usersession.js')
const {validationResult} = require('express-validator')
const Session = require('../model/session.js')
const responceMsg = require('../utilities/responceMsg.js')
const getUserDateFromToken = require('../utilities/getUserDateFromToken.js')
let adduserSession = async(req,res)=>{
try{
 let val =  await validationResult(req).errors

if (val?.length !=0 ){
    throw(val)
 }
 else{
    let newdata = await req.body
    let sessionid1 = await req.params.sid
    let userDate= await getUserDateFromToken(req)
    let userid1 = userDate._id
   let checksession = await Session.findOne({_id:sessionid1})
   if(!checksession){
    throw('Session Not Found')
   } else{
    let persentuserSession = await userSession.findOne({sessionId:sessionid1,userId:userid1})
    if(persentuserSession){
        throw('Session Already Sent')
    } else{
    let attended = await Session.findOne({_id:sessionid1}).select('sessionAttendance')
    let attendanceArray = attended.sessionAttendance
    let hasattended = attendanceArray.find((e)=>{
        if(e == userid1){
            return e
        }
    })
    let add = await new userSession({
        sessionId:sessionid1,
        userId:userDate._id,
        assignment:newdata.assignment,
        question:newdata.question,
        feedback:newdata.feedback,
        attended: hasattended ? true : false
    })
    let done = await add.save()
    if(done.assignment != newdata.assignment)
        {
            throw('Something Went Wrong, Please Try Again')
        
        }
        else{
            res.status(200).json({
                status:responceMsg.SUCCESS,
                data: add
            })

        }
    }
   }
 }
}
catch(er){
    let errors= []
    if(er?.message){
        errors = er.message
    } else if(er[0]?.location){
        errors = er.map((e)=>e.msg)
    }
    else{
        errors = er
    }
    res.status(400).json({
                status:responceMsg.FAIL,
                message: errors
            })
}
res.end()
}
let getUserSession = async(req,res)=>{
    try{
        let id = await req.params.id
        let getUser = await userSession.findOne({_id:id})
        console.log(getUser);
        if(!getUser){
            throw('User Session Not Found')
        } else{
            let userDate= await getUserDateFromToken(req)
            if(userDate.role !='1a' && userDate.role !='2i' &&  userDate._id != getUser.userId)
            {
                throw('Not Allowed')
            }else{
                res.status(200).json({
                    status: responceMsg.SUCCESS,
                    data: getUser
                })
            } 
        }
    }
    catch(er){
        res.status(400).json({
            status: responceMsg.FAIL,
            msg: er.message ? er.message : er
        })
    }
}
let updateUserSession = async(req,res)=>{
    try{let userSessionId = await req.params.id
        let checkUserSession = await userSession.findOne({_id:userSessionId})
        let userDate= await getUserDateFromToken(req)
        let userid1 = userDate._id
        if(userid1 != checkUserSession.userId ){
            throw('You Are Not Allowed To Edit This Session')
        }else{
            if(!checkUserSession){
                throw('Session Not Found')
             } else{
                let val = validationResult(req).errors
             if(val.lenght ==0){
                 throw(val)
             }
             else{
                 let data = await req.body
                 let userDate= await getUserDateFromToken(req)
                 let up = await userSession.updateOne({_id:userSessionId},{
                     assignment:data.assignment,
                     question: data.question,
                     feedback: data.feedback,
                     comment : data.comment,
                     updatedAt:Date.now(),
                     updatedBy:{
                         _id:userDate._id,
                         name:userDate.userName
                     }
                 })  
                 if(up.matchedCount ==0){
                     throw('Session Not Found')
                 }
                 else{
                     if(up.modifiedCount ==0){
                         throw('Nothing Updated')
                     }
                     else{
                         res.status(200).json({
                             status:responceMsg.SUCCESS,
                             data: 'Updated Successfully'
                         })
                     }
                 }
             }
             }
        }
        
    }
    catch(er){
        let errors=[]
        if(er[0]?.location){
            errors = er.map((e) => e.msg)
        }
        else if(er?.message){
            errors = er.message
        }
        else{
            errors = er
        }
        res.status(400).json({
            status:responceMsg.FAIL,
            data:errors
        })
    }
       res.end()
}

module.exports ={adduserSession,getUserSession,updateUserSession}