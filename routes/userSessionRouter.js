const express = require('express')
const Router = express.Router()
const userSessionController = require('../controller/userSessioncontroller.js')
const validationUserSession = require('../middlewares/validation/userSessionValidation.js')
const studentMiddlware = require('../middlewares/studentMiddlware.js')
Router.route('/:sid/add').post(studentMiddlware,validationUserSession(),userSessionController.adduserSession)
Router.route('/update/:id').patch(studentMiddlware,validationUserSession(),userSessionController.updateUserSession)
Router.route('/:id').get(studentMiddlware,userSessionController.getUserSession)
module.exports=Router 