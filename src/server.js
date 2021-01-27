// create server
const express = require('express')
const nunjucks = require('nunjucks')
const router = require('./routes')
const methodOverride = require('method-override')
const session = require("./config/session")
const server = express()


nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.set("view engine", "njk")

/* ====== MIDDLEWARE ====== */
server.use(session)
// NOTA: usa variável local
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})
server.use(express.urlencoded({ extended: true })) // Lê e mostra os dados da requisição
server.use(express.static("public"))
// app.use(função de middlaware obrigatória)

server.use(methodOverride('_method'))
server.use(router)

/* ====== MIDDLEWARE ====== */

server.listen(5000, function() {
    console.log('Listening on port 3000.')
})
