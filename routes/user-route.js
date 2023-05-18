const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')



//SIGNUP / REGISTER
router.post('/signup', userController.signup)

//LOGIN
router.post('/login', userController.login)

//VERIFY USER
router.get('/user', userController.verifyToken, userController.getUser)


module.exports = router