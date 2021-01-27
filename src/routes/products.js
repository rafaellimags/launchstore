const express = require('express')
const router = express.Router()
const multer = require('../app/middlewares/multer')
const ProductController = require('../app/controller/ProductController');
const SearchController = require('../app/controller/SearchController');
const { redirectToLogin } = require('../app/middlewares/session')

// Search
router.get('/search', SearchController.index)

// Products
router.get('/create', redirectToLogin, ProductController.create)
router.get('/:id', ProductController.show)
router.get('/:id/edit', redirectToLogin, ProductController.edit)

router.post('/', redirectToLogin, multer.array("photos", 6), ProductController.post)
router.put('/', redirectToLogin, multer.array("photos", 6), ProductController.put)
router.delete('/', redirectToLogin, ProductController.delete)

module.exports = router