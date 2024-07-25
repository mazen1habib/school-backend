const {body}=require('express-validator')
const User = require('../../model/user.js')
  let validationuser = ()=>{
    return[
        body('userName').notEmpty().withMessage("Name Can't Be Empty "),
        body('email').notEmpty().withMessage("email can't be empty " ).custom(async(n)=>{
            let user = await User.findOne({email:n})
            if(user){
                throw('User Already Be Exists With This Email')
            }
        }),
        body('password').notEmpty().withMessage("password can't be empty "),
        body('phone').notEmpty().withMessage("phone can't be empty ").custom(async(n)=>{
            let user = await User.findOne({phone:n})
            if(user){
                throw('User Phone Already Be Exists With This Phone')
            }
        }),
        body('role').notEmpty().withMessage("role can't be empty ").isIn(['1a','2i','3s'])
    ]
  }
  module.exports=validationuser