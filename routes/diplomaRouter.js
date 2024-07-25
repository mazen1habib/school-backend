const express = require('express')
const router= express.Router()
const diplomacontroller = require('../controller/diplomaController.js')
const validationdiploma = require('../middlewares/validation/diplomaValidation.js')
const adminMiddlewre = require('../middlewares/adminMiddleware.js')
const instructorMiddlewre = require('../middlewares/instructorMiddlwares.js')
const studentMiddlewre = require('../middlewares/studentMiddlware.js')
router.route('/').post(adminMiddlewre,validationdiploma(),diplomacontroller.AddDiploma).get(instructorMiddlewre,diplomacontroller.getAllDiploma)
router.route('/:id').get(studentMiddlewre,diplomacontroller.getSingleDiploma)
.patch(adminMiddlewre,validationdiploma(),diplomacontroller.updateDiploma)

module.exports=router