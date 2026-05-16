// config/emailConfig.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
        user: 'shahiddelhi989@gmail.com',     // Your email address
        pass: 'orvd swqd lpel wwxv'         // App password (not regular password)
    }
});

// For Gmail, you need to:
// 1. Enable 2-factor authentication
// 2. Generate an App Password
// 3. Use that password here

module.exports = transporter;