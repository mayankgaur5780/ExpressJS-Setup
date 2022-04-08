const Joi = require('joi');
const i18n = require('i18n');
const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables');
var jwt = require('jsonwebtoken');

const tableSchema = new mongoose.Schema({
    profile_image: {
        type: String,
        default: 'default-user.png',
        maxlength: 50,
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


tableSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
}

const User = mongoose.model('users', tableSchema);


function validatorMobile(user) {
    const schema = {
        dial_code: Joi.number().allow('').optional().label(i18n.__('dial_code')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        mobile: Joi.number().allow('').optional().label(i18n.__('mobile')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        })
    };

    return Joi.validate(user, schema);
}

function validatorOTP(user) {
    const schema = {
        otp: Joi.number().required().label(i18n.__('otp')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        })
    };
    return Joi.validate(user, schema);
}

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

module.exports = {
    'UserModel': User,
    validatorMobile,
    validatorOTP,
    validatorCreate,
    validatorUpdate,
};