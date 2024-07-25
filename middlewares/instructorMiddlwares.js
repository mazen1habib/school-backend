let decodeJwt = require('../utilities/decodeJWT.js')
const responceMsg = require('../utilities/responceMsg.js')
let checkInstructor= async(req,res,next)=>{
    try{
        let token = await req.cookies.jwt
        if(!token){
            throw('Please Login - No Token Provided')
        }
      let  checktoken = await decodeJwt(token)
      if(!checktoken){
        throw('Invalid Token')
      }else{
        if(checktoken.role != '1a' && checktoken.role != '2i' ){
            throw('You Are Not Allowed Here')
        }else{
            next()
        }
      }
    }catch(er){
        res.status(400).json({
            status: responceMsg.FAIL,
            data: er

        })
    }
}
module.exports= checkInstructor