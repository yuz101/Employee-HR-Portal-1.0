const router = require('express').Router()
const AuthController = require('../controllers/AuthController')

router.post('/signup', AuthController.signup)

router.post('/login', AuthController.login)

module.exports = router