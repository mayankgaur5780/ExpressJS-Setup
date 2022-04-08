const namedRoutes = {
    'admin.login.index': '/',
    'admin.change.locale': `${process.env.URL_PREFIX}/change/locale`,
    'admin.login': `${process.env.URL_PREFIX}/login`,
    'admin.dashboard.index': `${process.env.URL_PREFIX}/dashboard`,
};

module.exports = namedRoutes;