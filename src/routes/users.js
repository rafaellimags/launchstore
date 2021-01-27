const express = require('express')
const router = express.Router()
const SessionController = require('../app/controller/SessionController');
const UserController = require('../app/controller/UserController');

const UserValidator = require("../app/validators/user")
const SessionValidator = require("../app/validators/session")
const { isLoggedIn, redirectToLogin } = require("../app/middlewares/session")

// login-logout
router.get('/login', isLoggedIn, SessionController.loginForm)
router.post('/login', SessionValidator.login, SessionController.login)
router.post('/logout', SessionController.logout)
// // reset or forgot password
router.get('/forgot-password', SessionController.forgotForm)
router.get('/reset-password', SessionController.resetForm)
router.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
router.post('/reset-password', SessionValidator.reset, SessionController.reset)

// // user register UserController
router.get('/register', UserController.registerForm)
router.post('/register', UserValidator.post, UserController.post)

router.get('/', redirectToLogin, UserValidator.show, UserController.show)
router.put('/', UserValidator.update, UserController.update)
router.delete('/', UserController.delete)

module.exports = router