const Session = require('../model/session.js')
const responceMsg = require('../utilities/responceMsg.js')
const {validationResult}= require('express-validator')
const   Group = require('../model/group.js')
const   Diploma = require('../model/diploma.js')
const decodejwt = require('../utilities/decodeJWT.js')
const User = require('../model/user.js')
const getUserDateFromToken = require('../utilities/getUserDateFromToken.js')
let addSession = async(req,res)=>{
    try{
        let checkgroup ;
        let val = validationResult(req).errors
        if(val?.length !=0){
            throw(val)
        }else{
            let data = await req.body
            let param = await req.params 
            let userDate= await getUserDateFromToken(req)
           let  checkdiplomaandgroup = await Group.findOne({groupDiploma: param.diploma,groupName:param.group})
          if(!checkdiplomaandgroup){
            throw('Diploma Name or Group Name Not Found ,Please Enter the Correct Diploma or Group Name')
          }
            let add = await new Session({
                sessionDiploma:param.diploma,
                sessionGroup:param.group,
                sessionName:data.sessionName,
                sessionCreatedAt:Date.now(),
                sessionCreatedBy:{
                    _id:userDate._id,
                    name:userDate.userName
                },
                sessionMaterial:data.sessionMaterial,
                sessionAssignment:data.sessionAssignment,
                sessionQuestion:data.sessionQuestion,
                sessionAttendance:data.sessionAttendance
            })
            let done = await add.save()
            if(done.sessionGroup != param.group){
                throw('Something Went Wrong, Please Try Again')
            }
            else{
                let up = await Group.updateOne({groupName:param.group},{
                    $inc:{ groupCurrentSession:1}
                })
                if(up.matchedCount ==0){
                    throw('Group Not Found')
                }
                else{
                    if(up.modifiedCount !=1){
                        throw('Nothing Updated')
                    }
                    else{
                        res.status(200).json({
                            status:responceMsg.SUCCESS,
                            data:  add
                        })
                    }
                }
            }

        }
       
    }catch(er) {
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
let getAllSession =async(req,res)=>{
    try{
        let groupParams = await req.params.groupname
        let all;
         all = await Session.find({sessionGroup:groupParams})
        if(all.length == 0){
            throw('session not found')
        }else{
            let userDate= await getUserDateFromToken(req)
            let checkuser = await User.findOne({_id:userDate._id})
            if(userDate.role !='1a' && userDate.role !='2i'  && checkuser.group != groupParams){
                throw("Unauthorized viewing of this content")
            }
   else {
    res.status(200).json({
        status:responceMsg.SUCCESS,
        data :all
    })
   }     
        }
        
    }catch(er){
        res.status(400).json({
            status:responceMsg.FAIL,
            message: er 
        })
    }
    res.end()
}
let getSingleSession= async(req,res)=>{
    try{
        let pid = await req.params.id
        let single = await Session.findOne({_id:pid})
        if(single.length ==0){
            throw('Group is Not Found')
        }else{
            res.status(200).json({
                status:responceMsg.SUCCESS,
                data:single
            })
        }
    }catch(er){
        res.status(400).json({
            status:responceMsg.FAIL,
            error:er.message || er
        })
    }
    res.end()
}
let updateSession = async(req,res)=>{
    try{

        let pid = await req.params.id
        let newdata= await req.body
        if(!newdata){
            throw('Please Enter The New Data')
        }else{
            let userDate= await getUserDateFromToken(req)
            let up = await Session.updateOne({_id:pid},{
                sessionName:newdata.sessionName,
                sessionMaterial:newdata.sessionMaterial,
                sessionAssignment:newdata.sessionAssignment,
                sessionQuestion:newdata.sessionQuestion,
                // sessionAttendance:newdata.sessionAttendance,
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
       
    }catch(er){
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
module.exports={addSession,getAllSession,getSingleSession ,updateSession}