module.exports = function (req, res, next) {
	try {
		if (!(req.session.adminAuthenticated === true && req.cookies.session)) {
			return res.redirect(`/${process.env.URL_PREFIX}/login`);
        }
        next();
	} catch (ex) {
		next();
	}
}