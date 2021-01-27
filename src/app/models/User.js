const db = require('../../config/db')
const { hash } = require("bcrypt")
const fs = require("fs")
const Products = require("../models/Product")

module.exports = {
    async findOne(filters) {
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}
            `
            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })
        const results = await db.query(query)
        return results.rows[0]
    },
    async create(data) {

        try {
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `
            // Hash for password
            const passwordHash = await hash(data.password, 8)
            const values = [
                data.name,
                data.email,
                passwordHash,
                data.cpf_cnpj,
                data.cep,
                data.address,
            ]

            const results = await db.query(query, values)
            return results.rows[0].id
        } catch (error) {
            console.error(error)
        }

    },
    async update(id, fields) {

        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if ((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                query = `${query}
                ${key} = '${fields[key]}'
                WHERE id = ${id}
            `
            }
        })

        await db.query(query)
        return

    },
    async delete(id) {

        // pega todos os produtos
        let results = await db.query("SELECT * FROM products WHERE products.user_id = $1", [id])
        const products = results.rows
        // pega imagens dos produtos
        console.log(products)
        const allFilesPromise = products.map(product => {
            return Products.files(product.id)
        })
        let promiseResults = await Promise.all(allFilesPromise)

        // remove usuário
        await db.query("DELETE FROM users WHERE id = $1", [id])

        //remove da pasta public
        console.log(promiseResults)
        promiseResults.map(results => {
            results.rows.map(file => {
                try {
                    fs.unlinkSync(file.path)
                } catch (error) {
                    console.error(error)
                }
            })
        })
    }
}