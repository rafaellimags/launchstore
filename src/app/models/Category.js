const db = require('../../config/db')

module.exports = {
    showAll() {
        return db.query(`
            SELECT * FROM category
        `)
    },
    show(id) {
        return db.query(`
            SELECT * FROM category
            WHERE id = ${id}
        `)
    }
}