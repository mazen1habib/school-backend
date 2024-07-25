const User = require('../model/user.js')
const responceMsg = require('../utilities/responceMsg.js')
const {validationResult} = require('express-validator')
const Diploma = require('../model/diploma.js')
const Group = require('../model/group.js')
const bcrypt = require('bcrypt')
const incrementGroupStudent = require('../utilities/incrementGroupStudent.js')
const checkgroup = require('../utilities/checkGroup.js')
const getUserDateFromToken = require('../utilities/getUserDateFromToken.js')
 let registerUser = async(req,res)=>{
    try{
        let val = validationResult(req).errors
        if(val.length !=0){
            throw(val)
        }else{
            let data = await req.body
            console.log(data)
            let checkGroup;
            if(data.role === '3s' && !data.group){
                throw('Student Must Have a Group')
            }else{
                if(data?.role === '3s'){
                     checkGroup = await checkgroup(data.group)
            }
                    let hashpassword =await bcrypt.hash(data.password ,5)
                    let userDate= await getUserDateFromToken(req)
                    let addNewUser = await new User({
                        userName: data.userName,
                        email:data.email,
                        password:hashpassword,
                        phone:data.phone,
                        role:data.role,
                        diploma:checkGroup?.groupDiploma,
                        group:data.group,
                        userCreatedAt:Date.now(),
                        userCreatedBy:{
                            _id:userDate._id,
                            name:userDate.userName
                        }
                    })
                    let done = await addNewUser.save()
                    if(done.email != data.email)
                        {
                            throw('Something Went Wrong, Please Try Again')
                        
                        }
                        else{
                            if(done?.role === '3s'){
                                incrementGroupStudent(done.group,1)
                       }
                            res.status(200).json({
                                status:responceMsg.SUCCESS,
                                data: addNewUser
                            })
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
                    data: errors
                })
    }
    res.end()
 }
 let getUsers = async(req,res)=>{
    try{
        let types = await req.params.type
        let dbtype;
        if(types ==='admins' ){
            dbtype = '1a'
        } else if(types ==='instructors'){
            dbtype = '2i'
        } else if ( types === 'students'){
            dbtype = '3s'
        } else{
            throw(" Please Enter a Valid Type")
        } 
        // let alltype = await User.find({phone:{$regex:`/+${req.query.search}/`}})
        let alltype =  await User.find({role:dbtype}) 
       if(alltype.length == 0){
        throw('data Not Found')
        }
        else{
            res.status(200).json({
                status:responceMsg.SUCCESS,
                data: alltype 
            })
        }
    }
    catch(er){
res.status(400).json({
    status:responceMsg.FAIL,
    msg: er.message ? er.message : er
})
    }
 }
 let getSingleUser = async(req,res)=>{
    try{
        let userDate= await getUserDateFromToken(req)
        let userId = await userDate._id
        let checkUser = await User.findOne({_id:userId}) 
        if(!checkUser){
            throw('User Not Found')
        }else{
            res.status(200).json({
                status:responceMsg.SUCCESS,
                data: checkUser
            })
        }
    }catch(er){
        res.status(400).json({
            status:responceMsg.FAIL,
            data: er || er?.message
        })
    }
 }
let deleteUser = async(req,res)=>{
    try{
        let userid = await req.params.id
        let checkUserId = await User.findById(userid)
        if(checkUserId.role == '1a'){
            throw("Unable To Erase The Admin")
        }else{
           let delete1 = await User.deleteOne({_id : userid})
           if(delete1.deletedCount ==0){
            throw('Nothing Deleted')
        }
        else{
            if(checkUserId.role ==='3s'){
                incrementGroupStudent(checkUserId.group,-1)
            }
            res.status(200).json({
                status:responceMsg.SUCCESS,
                message:"delete Successfully"
            })
        }
        }
    }catch(er){
        if(er?.message){
            res.status(400).json({
                status:responceMsg.FAIL,
                error: er.message
            })
        }else {
            res.status(400).json({
                status:responceMsg.FAIL,
                error: er
            })
        }
    }
    res.end()
} 
let updateUserPassword = async(req,res)=>{
    try{ let userid = await req.params.id
        let newdatapassword =  await req.body.password
        let checkid = await User.findOne({_id:userid})
        if(!checkid)
            {
        throw('user not found')  
            }else{
                let hashpassword = await bcrypt.hash(newdatapassword,5)
                let userDate= await getUserDateFromToken(req)
                up = await User.updateOne({_id:userid},{
                    password : hashpassword,
                     updatedPasswordBy:{
                        _id:userDate._id,
                        name:userDate.userName
                    }
                })
                if(up.matchedCount !=1){
                    throw('user Group Not Found')
                }
                else{
                    if(up.modifiedCount !=1){
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
let updateUser = async(req,res)=>{
    try{
        let userId = await req.params.id
        let newdata = await req.body
        let checkUser = await User.findOne({_id:userId,role:'3s'}) 
        let checkGroup;
        if(!checkUser){
            throw('Student Not Found')
        }else {
            if(checkUser?.role === '3s'){
                checkGroup = await checkgroup(newdata.group)
                console.log(checkGroup);
       }
       let userDate= await getUserDateFromToken(req)
     let up = await User.updateOne({_id:userId},{
        diploma :checkGroup.groupDiploma,
        group:newdata.group,
        updatedAt:Date.now(),
        updatedBy:{
            _id:userDate._id,
            name:userDate.userName
        }
     })
     if(up.matchedCount !=1){
        throw('user Group Not Found')
    }
    else{
        if(up.modifiedCount !=1){
            throw('Nothing Updated')
        }
        else{
            incrementGroupStudent(checkUser.group,-1)
            incrementGroupStudent(newdata.group,1)
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
let hsingleUser = async(req,res)=>{
    try{
        let pid = await req.params.id
        let singleusers = await User.findOne({_id:pid})
        if(singleusers.length ==0){
            throw('User is Not Found')
        }else{
            res.status(200).json({
                status:responceMsg.SUCCESS,
                data:singleusers
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

 module.exports ={registerUser,getUsers,deleteUser,updateUser ,updateUserPassword ,getSingleUser,hsingleUser}