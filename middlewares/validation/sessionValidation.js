const {body} = require('express-validator')
let validationsession =()=>{
    return[
        body('sessionName').notEmpty().withMessage('Please Enter Session Name'),
        body('sessionMaterial').notEmpty().withMessage('Please Enter Material'),
        body('sessionAssignment').notEmpty().withMessage('Please Enter Assignment'),
        body('sessionAttendance').notEmpty().withMessage('Please Enter Attendance')
    ]
}
module.exports=validationsession