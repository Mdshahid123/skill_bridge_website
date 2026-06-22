// config/emailConfig.js
const nodemailer = require('nodemailer');

//Create transporter

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS
    }
});


// For Gmail, you need to:
// 1. Enable 2-factor authentication
// 2. Generate an App Password
// 3. Use that password here

module.exports = transporter;
