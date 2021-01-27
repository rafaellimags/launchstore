//NOTA: criaçaõ de token
const crypto = require("crypto")
const { hash } = require("bcrypt")
const User = require("../models/User")
const mailer = require("../../lib/mailer")

module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id
        return res.redirect("/users")
    },
    // NOTA: logout
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },
    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },
    //NOTA: token de recuperação - crypto
    async forgot(req, res) {
        const user = req.user

        try {
            const token = crypto.randomBytes(20).toString("hex")
            //cria data de expiração do token
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            //NOTA: email de recuperação de senha - nodemailer
            await mailer.sendMail({
                to: user.email,
                from: "no-reply@launchstore.com.br",
                subject: "Recuperação de senha",
                html: `<h2>Perdeu a senha?</h2>
                <p>Clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/users/reset-password?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `
            })

            return res.render("session/forgot-password", {
                success: "Verifique sua caixa de entrada para recuperar sua senha."
            })

        } catch (error) {
            console.error(error)
            return res.render("session/forgot-password", {
                error: "Erro inesperado. Tente novamente em alguns instantes."
            })
        }
    },
    resetForm(req, res) {
        return res.render("session/reset-password", { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user
        const { password, token } = req.body
        try {
            const newPassword = await hash(password, 8)
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })
            return res.render("session/login", {
                user: req.body,
                success: "Senha atualizada! Faça login novamente."
            })

        } catch (error) {
            console.error(error)
            return res.render("session/reset-password", {
                user: req.body,
                token,
                error: "Erro inesperado. Tente novamente em alguns instantes"
            })
        }
    }
}