const {body}= require('express-validator')
const Group = require('../../model/group.js')
const Diploma = require('../../model/diploma.js')
let validationGroup = ()=>{
    // let dip = await diploma.find().project( {diplomaName:true})
    // let diparray = dip.map((e)=>e.diplomaName)
    // const [] = diparray
    return [
        body('groupDiploma').notEmpty().withMessage('Please Enter Diploma Name').custom(async(data)=>{
            let checkDiploma = await Diploma.findOne({diplomaName:data})
            if(!checkDiploma){
                throw('There is no Diploma with this the name')
            }
        }),
        body('groupName').notEmpty().withMessage('Please Enter Group Name').custom(async(n)=>{
            let groups = await Group.findOne({groupName:n})
            if(groups){
                throw('group Name most be Unique')
            }
        }),
        body('groupStart').notEmpty().withMessage("Group Start Date isn't Empty"),
        body('groupSessions').notEmpty().withMessage("Please Enter Number of Sessions"),
    ]
}

module.exports= validationGroup