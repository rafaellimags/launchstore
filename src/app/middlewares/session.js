function redirectToLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/users/login")
    }
    next()
}

function isLoggedIn(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/users")
    }
    next()
}

module.exports = {
    redirectToLogin,
    isLoggedIn
}