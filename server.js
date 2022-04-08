const express = require('express');
const app = express();
const i18n = require("i18n");
const compression = require('compression');
const http = require('http');
const cors = require('cors');
const ejsLayouts = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParserErrorHandler = require('express-body-parser-error-handler');
const _ = require('lodash');
const {
    expressCspHeader,
    NONE,
    SELF,
    INLINE,
    HASHES,
    EVAL,
    DATA,
    BLOB,
    STRICT_DYNAMIC,
    NO_REFERER,
    NONE_WHEN_DOWNGRADE,
    ORIGIN,
    ORIGIN_WHEN_CROSS_ORIGIN,
    UNSAFE_URL,
    ALLOW_FORMS,
    ALLOW_MODALS,
    ALLOW_ORIENTATION_LOCK,
    ALLOW_POINTER_LOCK,
    ALLOW_POPUPS,
    ALLOW_POPUPS_TO_ESACPE_SANDBOX,
    ALLOW_PRESENTATION,
    ALLOW_SAME_ORIGIN,
    ALLOW_SCRIPTS,
    ALLOW_TOP_NAVIGATION
} = require('express-csp-header');

// Import ENV File
require('dotenv').config();


// Configure Locale
i18n.configure({
    locales: ['en', 'ar'],
    directory: __dirname + '/locales',
    defaultLocale: `${process.env.APP_LOCALE}`,
    queryParameter: 'locale',
});


// Add locales for EJS
app.locals._ = _;
app.locals.moment = moment;
app.locals.helper_fns = require('./utils/helpers');
app.set('trust proxy', 1);


// Setup DB
app.use(session({
    key: 'session',
    saveUninitialized: false, // don't create session until something stored
    resave: false, // don't save session if unmodified
    cookie: { secure: false },
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        stringify: false, // if you want to store object instead of id
    })
}));

// Add Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParserErrorHandler());
app.use(i18n.init);
app.set('views', './views'); // default
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public', {
    maxAge: 31536000,
    etag: true, // Just being explicit about the default.
    lastModified: true, // Just being explicit about the default.
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'max-age=31536000');
    },
}));
app.use(expressCspHeader({
    directives: {
        'script-src': [SELF, INLINE, EVAL, 'code.jquery.com', 'polyfill.io', 'cdnjs.cloudflare.com', 'ajax.googleapis.com', 'unsafe-eval']
    }
}));
app.use(compression());

app.use((req, res, next) => {
    res.locals.req = req;
    app.locals.req = req;
    var locale = `${process.env.APP_LOCALE}`;
    if (req.session.locale) {
        locale = req.session.locale;
    } else if (req.cookies.locale) {
        locale = req.cookies.locale;
        req.session.locale = locale;
    }
    i18n.setLocale(locale);
    i18n.setLocale(req, locale);
    i18n.setLocale(res, locale);
    i18n.setLocale(res.locals, locale);
    i18n.setLocale([req, res, res.locals], locale);

    if (req.params.locale != undefined && req.params.locale) {
        i18n.setLocale([req, res, res.locals], req.params.locale);
    }

    if (req.query.locale != undefined && req.query.locale) {
        i18n.setLocale([req, res, res.locals], req.query.locale);
    }

    if (req.body.locale != undefined && req.body.locale) {
        i18n.setLocale([req, res, res.locals], req.body.locale);
    }

    if (req.headers.locale != undefined && req.headers.locale) {
        i18n.setLocale([req, res, res.locals], req.headers.locale);
    }


    app.locals.PAGE_URL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    app.locals.admin = req.session.admin;

    next();
});

// Include Routes
require('./routes/routes')(app);

// Connect to DB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to mongoDB`))
    .catch(err => console.log('Failed to connect to mondoDB'));

// Trying to start the server
const port = process.env.APP_PORT || 3001;
const server = http.createServer(app);
server.listen(port, function () {
    console.log(`Server listening on port #${port}`);
});