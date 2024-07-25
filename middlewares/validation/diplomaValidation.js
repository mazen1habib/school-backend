const {body}= require('express-validator')
const diploma = require('../../model/diploma.js')
let validationdiploma=()=>{
    return[
        body('diplomaName').notEmpty().withMessage("Dilpoma Name can't Be Empty").custom(async(n)=>{
            let diplomas = await diploma.findOne({diplomaName:n})
            if(diplomas){
                throw('diploma  Name most be Unique')
            }
        }),
        body('price').notEmpty().withMessage("Price can't Be Empty").isNumeric().withMessage("Please Enter A valid Value , in Numbers")
    ]
}
 module.exports =validationdiploma