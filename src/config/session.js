// Controle de sessão
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const db = require("./db")

module.exports = session({
    store: new pgSession({
        pool: db
    }),
    secret: "chavesecreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // Em ms (mm/dd/hh/mm/ss)
        maxAge: 30*24*60*60*1000
    }
})