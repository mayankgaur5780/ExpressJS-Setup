const Joi = require('joi');
const i18n = require('i18n');
const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables');

const tableSchema = new mongoose.Schema({
    profile_image: {
        type: String,
        default: 'default-user.png',
        maxlength: 50,
    },
    admin_role_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'adminRoles',
    },
    name: {
        type: String,
        default: null,
        maxlength: 255
    },
    email: {
        type: String,
        default: null,
        maxlength: 255,
    },
    dial_code: {
        type: String,
        default: null,
        maxlength: 5
    },
    mobile: {
        type: String,
        default: null,
        maxlength: 15
    },
    password: {
        type: String,
        default: null,
        maxlength: 1024
    },
    remember_token: {
        type: String,
        default: null,
        maxlength: 1024
    },
    otp: {
        type: Number,
        default: null,
        maxlength: 4
    },
    status: {
        type: Number,
        default: 1,
        maxlength: 1
    }
}, {
    timestamps: true
});

tableSchema.plugin(dataTables);

const Admin = mongoose.model('admins', tableSchema);

function validatorCreate(user) {
    const schema = {
        name: Joi.string().required().label(i18n.__('name')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        email: Joi.string().required().email().label(i18n.__('email')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        dial_code: Joi.number().allow('').optional().label(i18n.__('dial_code')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        mobile: Joi.number().allow('').optional().label(i18n.__('mobile')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        profile_image: Joi.string().allow('').optional().label(i18n.__('image')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        role_id: Joi.objectId().required().label(i18n.__('role')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        password: Joi.string().required().label(i18n.__('password')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        confirm: Joi.string().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: i18n.__('must_match_password') } } }).label(i18n.__('confirm_password')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        status: Joi.any().valid('0', '1').required().label(i18n.__('status')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        })
    };

    return Joi.validate(user, schema);
}

function validatorUpdate(user) {
    const schema = {
        name: Joi.string().required().label(i18n.__('name')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        email: Joi.string().required().email().label(i18n.__('email')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        dial_code: Joi.number().allow('').optional().label(i18n.__('dial_code')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        mobile: Joi.number().allow('').optional().label(i18n.__('mobile')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        role_id: Joi.objectId().required().label(i18n.__('role')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        profile_image: Joi.string().allow('').optional().label(i18n.__('image')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        status: Joi.any().valid('0', '1').required().label(i18n.__('status')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        })
    };

    return Joi.validate(user, schema);
}

function validatorLogin(user) {
    const schema = {
        email: Joi.string().required().email().label(i18n.__('email')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        password: Joi.string().required().label(i18n.__('password')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        remember_me: Joi.allow('').optional().label(i18n.__('remember_me')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        })
    };

    return Joi.validate(user, schema);
}

function validatorUpdatePassword(user) {
    const schema = {
        password: Joi.string().required().label(i18n.__('password')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        confirm: Joi.string().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: i18n.__('must_match_password') } } }).label(i18n.__('confirm_password')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        })
    };

    return Joi.validate(user, schema);
}

function validatorForgotPassword(user) {
    const schema = {
        email: Joi.string().required().email().label(i18n.__('email')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
    };

    return Joi.validate(user, schema);
}

function validatorResetPassword(user) {
    const schema = {
        old_password: Joi.string().required().label(i18n.__('old_password')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        password: Joi.string().required().label(i18n.__('password')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        confirm: Joi.string().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: i18n.__('must_match_password') } } }).label(i18n.__('confirm_password')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        })
    };

    return Joi.validate(user, schema);
}

module.exports = {
    'AdminModel': Admin,
    validatorCreate,
    validatorUpdate,
    validatorLogin,
    validatorUpdatePassword,
    validatorForgotPassword,
    validatorResetPassword,
};