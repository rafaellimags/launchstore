const { formatCurrency } = require('../../lib/utils')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        let results = await Product.all()
        const products = results.rows

        if (!products) return res.send("Product not found")

        
        async function getImage(productId) {
            let results = await Product.files(productId)
            const images = results.rows.map(image => `${req.protocol}://${req.headers.host}${image.path.replace("public","").replace(/\\/g, "/")}`)
            return images[0]
        }

        const productsPromise = products.map(async product => {
            product.img = await getImage(product.id)
            product.price = formatCurrency(product.price)
            product.oldPrice = formatCurrency(product.old_price)
            return product
        }).filter((product, index) => index > 2 ? false : true)

        const lastAdded = await Promise.all(productsPromise)
        return res.render("home/index", { products: lastAdded })
    }
}