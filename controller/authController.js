const User = require('../model/user.js')
const bcrypt = require('bcrypt')
const  responceMsg = require('../utilities/responceMsg.js')
const signJwt = require('../utilities/signJWT.js')
const {validationResult} = require('express-validator')
let userLogin =async(req,res)=>{
  try{
    let credentials = await req.body
    let val = validationResult(req).errors
    if(val?.length !=0){
        throw(val)
    }else{
        if(!credentials.email || !credentials.password){
            throw('Please Enter Email and Password')
        }
        else
       {
        let checkuser = await User.findOne({email:credentials.email})
        if(!checkuser){
            throw('User Not Found')
        }
        else {
            let checkpassword = await bcrypt.compare(credentials.password,checkuser.password)
            if(checkpassword !=1){
                throw('Missing Password')
            }else{
                let token = await signJwt({
                    userID:checkuser._id,
                    role:checkuser.role
                })
                res.status(200).cookie('jwt',token).json({
                    status:responceMsg.SUCCESS,
                    data:token
                })
            }
        }
        }    
    }
   
    }catch(er){
        res.status(400).json({
                    status:responceMsg.FAIL,
                    data:er
                })
    }
    res.end()
}
module.exports ={userLogin}