const i18n = require('i18n');
const router = require('express').Router();
const adminAuth = require('../../middlewares/admin_auth');
const { successResp, errorResp } = require('../../utils/helpers');

router.get('/dashboard', adminAuth, async (req, res) => {
    res.render('admin/dashboard/index', {
        layout: "admin/layouts/masterLayout",
        title: i18n.__('dashboard'),
    });
});

module.exports = router; 