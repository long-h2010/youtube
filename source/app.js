const createError = require('http-errors');
const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

// Initial connect to database
const connection = require('./utils/database.js');
const credentials = require('./utils/credentials.js');
const convertBuffer2Boolean = require('./utils/helper/helper.js').convertBuffer2Boolean;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const app = express();

// View engine setup
app.engine('handlebars', hbs.engine({
    defaultsLayout: 'main',
}))
app.engine('.hbs', hbs.engine({
    extname: '.hbs',
    partialDir: path.join(__dirname, 'views', 'partials'),
    helpers: {
        inc: function(value, options) {
            return parseInt(value, 10) + 1;
        },
        displayHide: function(value, options) {
            return value === true ? 'true' : 'false';
        },
        check: function(value, options) {
            return value === true ? 'checked' : '';
        },
        checkBuffer: function(value) {
            return !convertBuffer2Boolean(value);
        },
        eq: function(a, b) {
            return a == b;
        },
        displayDate: function(value, options) {
            return value.toLocaleDateString();
        },
        displayTime: function(value, options) {
            return value.toLocaleTimeString();
        },
        displayNumber: function(value) {
            return parseInt(value).toLocaleString('en-US');
        },
        readableNumber: function readableNumber(value) {
            let res = '';
            let view = parseFloat(value);
            if (view > 1000000000) {
                res = `${(view / 1000000000).toFixed(1)} T`;
            } else if (view > 1000000) {
                res = `${(view / 1000000).toFixed(1)} Tr`;
            } else if (view > 1000) {
                res = `${(view / 1000).toFixed(1)} N`;
            } else {
                res = value;
            }
            return res.toString().replace('.', ',');
        },
        dateAgo(value) {
            let dateAgo = '';
            const timeSpan = new Date() - value;
            if (timeSpan <= 60000) {
                dateAgo = `${Math.floor(timeSpan / 1000)} giây trước`;
            } else if (timeSpan <= 3600000) {
                dateAgo = `${Math.floor(timeSpan / 60000)} phút trước`;
            } else if (timeSpan <= 86400000) {
                dateAgo = `${Math.floor(timeSpan / 3600000)} giờ trước`;
            } else if (timeSpan <= 2592000000) {
                dateAgo = `${Math.floor(timeSpan / 86400000)} ngày trước`;
            } else if (timeSpan <= 31536000000) {
                dateAgo = `${Math.floor(timeSpan / 2592000000)} tháng trước`;
            } else {
                dateAgo = `${Math.floor(timeSpan / 31536000000)} năm trước`;
            }
            return dateAgo;
        }
    }
}));

app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: credentials.cookie.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));

// Use for flash message
app.use(flash());

app.use('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Set locals user information when login
app.use(function(req, res, next) {
    if (req.cookies.userlogin) {
        req.session.userlogin = req.cookies.userlogin.user;
    }
    if (req.session.userlogin) {
        res.locals = {
            userlogin: req.session.userlogin,
        };
    }
    next();
});

app.use('/account', usersRouter);
app.use('/admin', adminRouter);
app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if (err.status == 404) {
        return res.render('404');
    }

    console.log(err)

    // Render the error page
    res.status(err.status || 500)
    res.render('error', { layout: false })
});

module.exports = app;