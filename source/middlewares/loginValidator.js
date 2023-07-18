const form = require('express-form')

module.exports = form(
    form.field("email").trim().required().isEmail(),
    form.field("password").trim().minLength(6).required().is(/^[a-zA-Z0-9]+$/),
)