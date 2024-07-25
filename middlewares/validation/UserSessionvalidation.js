const {body} = require('express-validator')

let validationUserSession=()=>{
    return [
        body('assignment').notEmpty().withMessage("Assignment Can't Be Empty"),
        body('feedback').notEmpty().withMessage("Feedback Can't Be Empty"),
        body('question').notEmpty().withMessage("Question Can't Be Empty")
    ]
}
module.exports= validationUserSession