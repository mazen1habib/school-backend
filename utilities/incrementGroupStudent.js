const Group = require('../model/group.js')
let incrementGroupStudent =async(checkGroupName,number)=>{

    let incrementGroup = await Group.updateOne({groupName:checkGroupName},{
        $inc:{groupStudents:number}
    })
    if(incrementGroup.matchedCount !=1){
        throw('Group Not Found')
    }else{
        if(incrementGroup.modifiedCount !=1){
            throw('Nothing Changed, Please Try Agein')
        }else{
            return 'Done'
        }
    }
}
module.exports= incrementGroupStudent