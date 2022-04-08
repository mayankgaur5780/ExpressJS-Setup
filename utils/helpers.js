const i18n = require("i18n");
const namedRoutes = require('../routes/namedRoutes');

function successResp({ res, template = '', httpCode = 200, data = null, isString = false }) {
    return res.status(httpCode).send({
        message: isString ? template : i18n.__(template),
        data,
    });
}

function errorResp({ res, template = null, isObject = false, httpCode = 422, isAjax = false, isString = false }) {
    if (isObject == true) {
        if (isAjax == true) {
            return res.status(httpCode).send({ message: template });
        }
        else if (template) {
            delete (template.path)
            delete (template.type)
            delete (template.context)
        }

        return res.status(httpCode).send(template);
    } else {
        return res.status(httpCode).send({ message: isString ? template : i18n.__(template) });
    }
}

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

async function sendSMS({ Recipient, Body }) {
    try {
        var params = {
            Recipient,
            Body,
            SenderID: config.get('SMS_SenderID'),
            AppSid: config.get('SMS_AppSid')
        };
        var result = await new Promise(function (resolve, reject) {
            request.post({ url: 'http://basic.unifonic.com/rest/SMS/messages', form: params }, function (error, httpResponse, body) {
                if (!error && httpResponse.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    resolve(JSON.parse(error));
                }
            })
        });
        // console.log(result);
        winston.info("OTP Sent:" + JSON.stringify(result));
        return result;
    } catch (error) {
        console.error(error);
        winston.error("sendSMS Exception:");
        try {
            stack = new Error().stack;
        } catch (error) { }
        winston.error(stack);
        return stack;
    }

}

async function sendEmail(to, template, data, subject, locale) {

    try {
        var MAIL_USERNAME = config.get('MAIL_USERNAME');
        var MAIL_PASSWORD = config.get('MAIL_PASSWORD');
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            host: 'mail.drdsh.live',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: MAIL_USERNAME, // user
                pass: MAIL_PASSWORD // password
            }
        });
        locale = locale ? locale : i18n.getLocale();
        var filePath = (__dirname + `/../views/emails/${locale}/${template}.ejs`);
        winston.info(`SENDING EMAIL TEMPLATE: ${to}-${subject}`);
        ejs.renderFile(filePath, data, async function (err, html_body) {
            if (err) {
                winston.info(`PARSING OF EMAIL ERROR: ${to}-${subject}`);
                try {
                    stack = new Error().stack;
                } catch (error) { }
                winston.error(stack);
                return winston.error(JSON.stringify(err));
            }

            var response = await sendBulkEmail({ to_emails: to, email_subject: subject, email_message: html_body });
            winston.info(`RESPONSE OF EMAIL: ${to}-${subject}-${JSON.stringify(response)}`);
            return response;

            // setup email data with unicode symbols
            var mailOptions = {
                from: `"${i18n.__('app_name')} " <${MAIL_USERNAME}>`, // sender address
                to: to, // list of receivers
                subject: `${subject}`, // Subject line
                html: html_body // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                winston.info(`RESPONSE OF EMAIL: ${to}-${subject}`);
                if (error) {
                    return winston.error(error);
                }
                return winston.info(JSON.stringify(info));
            });
        });
    } catch (error) {
        winston.info(`SENDING EMAIL FAILED`);
        winston.info(error);

    }
}

function buildFileLink(file) {
    return `/uploads/files/${file}`;
}

function uploadFile(req, res, fileName, fileLocation, cdn = false) {
    var uploadedFilename = '';
    var upload = null;
    var generateFileName = file => {
        var customName = crypto.randomBytes(18).toString('hex');
        var fileExtension = file.originalname.split('.')[file.originalname.split('.').length - 1] // get file extension from original file name
        uploadedFilename = `${customName}.${fileExtension}`;
        return uploadedFilename;
    };
    if (cdn) {
        AWS.config.update({
            "accessKeyId": config.get('AWS_ACCESS_KEY_ID'),
            "secretAccessKey": config.get('AWS_SECRET_ACCESS_KEY'),
            "region": config.get('AWS_DEFAULT_REGION')
        });
        upload = multer({
            storage: multerS3({
                s3: new AWS.S3(),
                bucket: config.get('AWS_BUCKET'),
                acl: config.get('AWS_ACCESS_CONTROL'),
                metadata: (req, file, cb) => {
                    cb(null, { fieldName: file.fieldname });
                },
                key: (req, file, cb) => {
                    cb(null, `uploads/${fileLocation}/${generateFileName(file)}`);
                }
            })
        }).single(fileName);
    } else {
        upload = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, path.join(__dirname, `../public/uploads/${fileLocation}/`))
                },
                filename: (req, file, cb) => {
                    cb(null, generateFileName(file));
                }
            })
        }).single(fileName);
    }
    return new Promise(function (resolve, reject) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                winston.error("A Multer error occurred when uploading.");
                console.log("A Multer error occurred when uploading.");
                reject(new Error(err));
            } else if (err) {
                winston.error("An unknown error occurred when uploading.");
                console.log("An unknown error occurred when uploading.");
                reject(new Error(err));
            }
            resolve(uploadedFilename);
        });
    });
}

function trans(phrase, locale, object = {}) {
    locale = locale === undefined ? process.env.APP_LOCALE : locale;
    return i18n.__({ phrase, locale }, object);
}

function router(name, params = {}) {
    return namedRoutes[name] === undefined ? '/' : `/${namedRoutes[name]}`;
}

module.exports = {
    successResp,
    errorResp,
    generateOTP,
    sendSMS,
    sendEmail,
    buildFileLink,
    uploadFile,
    trans,
    router,
};