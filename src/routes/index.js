const express = require('express')
const router = express.Router()
const HomeController = require('../app/controller/HomeController');
const products = require('./products')
const users = require('./users')

router.use('/users', users)
// Home
router.get('/', HomeController.index);

router.use('/products', products)

// Alias
router.get("/accounts", function(req, res) {
    return res.redirect("/users/login")
})

module.exports = router