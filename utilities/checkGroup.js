const Diploma = require('../model/diploma.js')
const Group = require('../model/group.js')
let checkgroup = async(group)=>{
        let checkGroup = await Group.findOne({groupName:group})
        if(!checkGroup){
            throw(' Group Not Found')
        }else{
            return  checkGroup
    }   
}

module.exports= checkgroup