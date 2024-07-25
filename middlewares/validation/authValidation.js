const {body}= require('express-validator')
const diploma = require('../../model/user.js')
let authValidation=()=>{
    return[
        body('email').notEmpty().withMessage(" email can't Be Empty"),
        body('password').notEmpty().withMessage("password can't Be Empty")
    ]
}
 module.exports =authValidation