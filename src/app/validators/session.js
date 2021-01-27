const User = require("../models/User")
const { compare } = require("bcrypt")

async function login(req, res, next) {   
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("session/login", {
        user: req.body,
        error: "Usuário não encontrado."
    })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("session/login", {
        user: req.body,
        error: "Senha incorreta"
    })
    req.user = user
    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        
        let user = await User.findOne({ where: { email } })
        if (!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "E-mail não cadastrado."
        })
        req.user = user
        next()

    } catch (error) {
        console.error(error)
    }
}

async function reset(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("session/reset-password", {
        user: req.body,
        token,
        error: "Usuário não encontrado."
    })

    if (password != passwordRepeat) {
        return res.render("session/reset-password", {
            user: req.body,
            token,
            error: "As senhas são diferentes"
        })
    }

    if (token != user.reset_token) {
        return res.render("session/reset-password", {
            user: req.body,
            token,
            error: "Token inválido. Solicite uma nova recuperação de senha."
        })
    }

    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) {
        return res.render("session/reset-password", {
            user: req.body,
            token,
            error: "Token expirado! Solicite uma nova recuperação de senha."
        })
    }

    req.user = user
    next()
}

module.exports = {
    login,
    forgot,
    reset
}