const express = require('express')
const router = express.Router()
const groupController= require('../controller/groupController.js')
const adminMiddlewre = require('../middlewares/adminMiddleware.js')
const instructorMiddlware = require('../middlewares/instructorMiddlwares.js')
const studentMiddlware = require('../middlewares/studentMiddlware.js')
const validationGroup = require('../middlewares/validation/groupValidation.js')

 router.route('/').post(adminMiddlewre,validationGroup(),groupController.addGroup).get(instructorMiddlware,groupController.getAllGroup)
 router.route('/:id').get(studentMiddlware,groupController.getSingleGroup)
 .patch(adminMiddlewre,validationGroup(),groupController.updateGroup)
 .delete(adminMiddlewre,groupController.deleteGroup)
 router.route('/diplomaName/:dname').get(instructorMiddlware,groupController.diplomaGroup)
 module.exports =router