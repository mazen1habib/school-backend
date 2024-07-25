const express = require('express')
const Router = express.Router()
const authController = require('../controller/authController.js')
const authValidation = require('../middlewares/validation/authValidation.js')
Router.route('/login').post(authValidation(),authController.userLogin)
 module.exports=Router