    const Jwt = require('jsonwebtoken')
    let siginjwt = async(payload)=>{
        let token =  Jwt.sign(payload,process.env.JWT)
        return token
    }
    module.exports=siginjwt