const form = require('express-form')

module.exports = form(
    form.field("email").trim().required().isEmail(),
    form.field("name").trim().required(),
    form.field("password").minLength(6).trim().required().is(/^[a-zA-Z0-9]+$/),
    form.field("comfirm_password").trim().required().equals("field::password"),
)