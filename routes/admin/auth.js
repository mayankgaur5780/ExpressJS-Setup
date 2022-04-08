const i18n = require('i18n');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const { successResp, errorResp } = require('../../utils/helpers');
const { AdminModel, validatorLogin } = require('../../models/admin');

router.get('/', async (req, res) => {

    // const salt = await bcrypt.genSalt(10);
    // const password = await bcrypt.hash('111111', salt);

    // const adminRole = new AdminRoleModel();
    // adminRole.name = 'Admin';
    // adminRole.en_name = 'Admin';
    // await adminRole.save();

    // const admin = new AdminModel();
    // admin.admin_role_id = adminRole._id;
    // admin.email = 'admin@htf.sa';
    // admin.password = password;
    // await admin.save();

    res.render('admin/auth/login', {
        layout: "admin/layouts/loginLayout",
        title: i18n.__('login'),
    });
});

router.get('/login', async (req, res) => {
    res.render('admin/auth/login', {
        layout: "admin/layouts/loginLayout",
        title: i18n.__('login'),
    });
});

router.get('/change/locale', async (req, res) => {
    let locale = ['en', 'ar'].indexOf(req.query.locale) < 0 ? process.env.APP_LOCALE : req.query.locale;
    req.session.locale = locale;
    res.cookie('locale', locale);
    return res.redirect('back');
});

router.post('/login', async (req, res) => {
    try {
        const { error } = validatorLogin(req.body);
        if (error !== null) {
            return errorResp({ res, template: error.details[0].message, isString: true });
        }

        const admin = await AdminModel.findOne({ email: req.body.email });
        if (admin === null) {
            return errorResp({ res, template: 'invalid_combination' });
        }
        else if (!await bcrypt.compare(req.body.password, admin.password)) {
            return errorResp({ res, template: 'invalid_combination' });
        }
        else if (admin.status != 1) {
            return errorResp({ res, template: 'account_inactive' });
        }

        delete admin.password;
        delete admin.remember_token;

        req.session.adminAuthenticated = true;
        req.session.admin = admin;

        return successResp({ res, template: 'success' });

    } catch (error) {
        console.log('IN');
        console.log({ error });
    }
});

module.exports = router; 