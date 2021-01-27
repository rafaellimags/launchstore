const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({ filename, path, product_id }) {

        const query = `
            INSERT INTO files (
                name,
                path,
                product_id
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            filename,
            path,
            product_id
        ]

        return db.query(query, values)
    },
    async delete(id) {

        try {

            const result = await db.query('SELECT * FROM files WHERE id = $1', [id])
            const image = result.rows[0]
            fs.unlinkSync(image.path)

        } catch (error) {
            console.error(error)
        }

        return db.query('DELETE FROM files WHERE id = $1', [id])
    }
}
