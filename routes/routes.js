var auth = require('./admin/auth');
var dashboard = require('./admin/dashboard');

module.exports = function (app) {
	app.use(`/${process.env.URL_PREFIX}`, auth);
	app.use(`/${process.env.URL_PREFIX}`, dashboard);
}