const Joi = require('joi');
const i18n = require('i18n');
const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables');

const tableSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
        maxlength: 255
    },
    en_name: {
        type: String,
        default: null,
        maxlength: 255
    },
}, {
    timestamps: true
});

tableSchema.plugin(dataTables);

const AdminRole = mongoose.model('admin_roles', tableSchema);

function validatorCreate(user) {
    const schema = {
        name: Joi.string().required().label(i18n.__('name')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        }),
        en_name: Joi.string().required().label(i18n.__('name')).error(errors => {
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
        en_name: Joi.string().required().label(i18n.__('name')).error(errors => {
            return errors.map(err => {
                return { message: i18n.__(`joi.${err.type}`, err.context) };
            });
        })
    };

    return Joi.validate(user, schema);
}

module.exports = {
    'AdminRoleModel': AdminRole,
    validatorCreate,
    validatorUpdate,
};