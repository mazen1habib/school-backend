const diploma =require('../model/diploma.js')
const responceMsg= require('../utilities/responceMsg.js')
const {validationResult} = require('express-validator')
const decodejwt = require('../utilities/decodeJWT.js')
const User = require('../model/user.js')
const getUserDateFromToken = require('../utilities/getUserDateFromToken.js')
let AddDiploma = async(req,res)=>{
    try{
        let val = validationResult(req).errors
        console.log(val);
        if(val?.length !=0){
          throw(val) 
        } else{
            let data = await req.body
            let userDate= await getUserDateFromToken(req)
        let newdata = await new diploma({
            diplomaName:data.diplomaName,
            price:data.price,
            diplomaCreatedAt:Date.now(),
            diplomaCreatedBy:{
                _id:userDate._id,
                name:userDate.userName
            }})
        let done = await newdata.save()
        if(done.diplomaName != data.diplomaName){
            
            throw('Something Went Wrong, Please Try Again')
        }
        else{
            res.status(200).json({
                status:responceMsg.SUCCESS ,
                data: done
            })
        }
        }
        
    }catch(er){
let errorr = await er.map((e)=> e.msg)
        res.status(400).json({
                    status:responceMsg.ERROR ,
                    message: [errorr]
                })
    }
    res.end()
}
let getAllDiploma = async(req,res)=>{
    try{
        let alldiploma = await diploma.find({})
        res.status(200).json({
            status:responceMsg.SUCCESS,
            data:alldiploma
        })
    }
    catch(er){
console.log(er);
res.status(400).json({
    status:responceMsg.ERROR ,
    message: er
})
    }
   res.end()
}
let getSingleDiploma=async(req,res)=>{
    try{
        let pid = await req.params.id
        let singleDiploma = await diploma.findOne({_id:pid})
        if(singleDiploma.length ==0){
            throw('Diploma Not Found')
        } else{
            res.status(200).json({
                status:responceMsg.SUCCESS,
                data:singleDiploma
            })
        }       
    }
    catch(er){
            res.status(400).json({
                status:responceMsg.FAIL,
                message:er.message || er
            })

       
    }
    res.end()
}
let updateDiploma = async(req,res)=>{
    try{let diplomaId = await req.params.id
        let val = validationResult(req).errors
        if(val?.length !=0){
          throw(val) 
        } else{
            let newdata = await req.body
            let userDate= await getUserDateFromToken(req)
        let updated =  await diploma.updateOne({_id:diplomaId},{
            diplomaName:newdata.diplomaName,
            price:newdata.price,
            updatedAt:Date.now(),
            updatedBy:{
                _id:userDate._id,
                name:userDate.userName
            }
        })
        if(updated.matchedCount ==0){
            throw('Diploma Not Found')
        }else{
            if(updated.modifiedCount ==0){
                throw('Nothing Updated')
            }
            else{
                res.status(200).json({
                    status:responceMsg.SUCCESS,
                    data: newdata
                })
            }
        }
        
        }
       
    }
        catch(er){
            let errors =[]
            if(er[0]?.location){
               errors = er.map((e) => e.msg)
            }else if(er?.message){
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
module.exports={AddDiploma,getAllDiploma,getSingleDiploma ,updateDiploma}