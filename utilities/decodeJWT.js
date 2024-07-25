const Jwt = require('jsonwebtoken')
let decodejwt = async(token)=>{
    let decodeData= await Jwt.verify(token,process.env.JWT)
    return decodeData
}
module.exports=decodejwt