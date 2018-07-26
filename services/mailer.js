const nodemailer = require('nodemailer');
const keys = require('../config');
module.exports = transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: keys.mailUserName,
      pass: keys.mailPassword
    },
    tls: {
        rejectUnauthorized: false
    }
})