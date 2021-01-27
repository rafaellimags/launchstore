const utils = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const { date } = require('../../lib/utils')

module.exports = {
    async create(req, res) {

        const results = await Category.showAll()
        const categories = results.rows

        return res.render('products/create.njk', { categories })
    },
    async post(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_images") {
                return res.send('Preencha todos os campos obrigatórios.')
            }
        }


        if (req.files.length == 0) {
            return res.send('Envie pelo menos uma imagem.')
        }

        
        req.body.user_id = req.session.userId

        let results = await Product.create(req.body)
        const product = results.rows[0]


        const filesPromise = req.files.map(file =>
            File.create({
                ...file,
                product_id: product.id
            })
        )

        await Promise.all(filesPromise)

        return res.redirect(`/products/${product.id}`)
    },
    async show(req, res) {

        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if (!product) return res.send('Produto não encontrado.')

        const { day, month, hours, minutes } = utils.date(product.updated_at)

        product.published = {
            day: `${day}/${month}`,
            hour: `${hours}h ${minutes}`,
        }

        product.oldPrice = utils.formatCurrency(product.old_price)
        product.price = utils.formatCurrency(product.price)

        results = await Product.files(product.id)
        const images = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))

        return res.render('products/show', { product, images })
    },
    async edit(req, res) {

        let results = await Product.find(req.params.id)
        let product = results.rows[0]

        if (!product) return res.send('Product not found!')

        product.price = utils.formatCurrency(product.price)
        product.old_price = utils.formatCurrency(product.old_price)

        // get categories
        results = await Category.showAll(product.category_id)
        const categories = results.rows

        //get images
        results = await Product.files(product.id)
        let images = results.rows
        //retorna imediatamente um objeto
        images = images.map(image => ({
            ...image,
            src: `${req.protocol}://${req.headers.host}${image.path.replace('public','')}`
        }))


        return res.render('products/edit.njk', { product, categories, images })

    },
    async put(req, res) {
        const keys = Object.keys(req.body)


        for (key of keys) {
            if (req.body[key] == "" && key !== "removed_images") {
                return res.send('Preencha todos os campos obrigatórios.')
            }
        }

        if (req.files.length != 0) {
            const newImagesPromise = req.files.map(image => {
                File.create({...image, product_id: req.body.id})
            })
            await Promise.all(newImagesPromise)
        }

        if (req.body.removed_images) {
            const removedImages = req.body.removed_images.split(',')
            const lastIndex = removedImages.length -1
            removedImages.splice(lastIndex, 1)
            const removedImagesPromise = removedImages.map(imageId => File.delete(imageId))
            await Promise.all(removedImagesPromise)
        }


        req.body.price = req.body.price.replace(/\D/g,"")
        req.body.old_price = req.body.old_price.replace(/\D/g,"")

        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}`)

    },
    async delete(req, res) {

        await Product.delete(req.body.id)
        return res.redirect('/products/create')
    }
}