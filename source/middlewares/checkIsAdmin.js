module.exports = function(req, res, next) {
    // Redirect to login if not admin login
    if (!req.session.userlogin || req.session.userlogin.role_id !== 1) {
        return res.redirect('/login');
    }
    next();
}