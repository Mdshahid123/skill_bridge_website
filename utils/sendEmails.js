// utils/sendEmail.js
const transporter = require('../config/emailConfig');

async function sendInquiryEmail(formData) {
    const { name, email, phoneNumber, course, callbackTime, message ,degree} = formData;
    
    // Email to Admin (you)
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Your admin email
        subject: `New Admission Inquiry from ${name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #0a2b3e; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; border: 1px solid #ddd; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #0a2b3e; }
                    .footer { text-align: center; padding: 20px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Admission Inquiry</h2>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">Full Name:</div>
                            <div>${name}</div>
                        </div>
                        <div class="field">
                            <div class="label">Email:</div>
                            <div>${email}</div>
                        </div>
                        <div class="field">
                            <div class="label">Phone:</div>
                            <div>${phoneNumber}</div>
                        </div>
                        <div class="field">
                            <div class="label">Interested Course/degree:</div>
                            <div>${course || degree || 'Not specified'}</div>
                        </div>
                        <div class="field">
                            <div class="label">Preferred Callback Time:</div>
                            <div>${callbackTime || 'Not specified'}</div>
                        </div>
                        <div class="field">
                            <div class="label">Message:</div>
                            <div>${message || 'No message provided'}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Skill Bridge Admission System</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    // Auto-reply to Student
    const studentMailOptions = {
        from:  process.env.EMAIL_USER,
        to: email, // Send to the student who filled the form
        subject: 'Thank you for your inquiry - Skill Bridge',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #0a2b3e; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .footer { text-align: center; padding: 20px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Welcome to Skill Bridge!</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${name},</p>
                        <p>Thank you for your interest in Skill Bridge! We have received your admission inquiry.</p>
                        <p><strong>Your inquiry details:</strong></p>
                        <ul>
                            <li>Interested Course/degree: ${course || degree || 'Not specified'}</li>
                            <li>Preferred Time: ${callbackTime || 'Not specified'}</li>
                        </ul>
                        <p>Our admission counselor will contact you within 24 hours at <strong>${phoneNumber}</strong>.</p>
                        <p>If you have any immediate questions, feel free to reply to this email.</p>
                        <br>
                        <p>Best regards,<br><strong>Skill Bridge Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Skill Bridge. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        // Send email to admin
        await transporter.sendMail(adminMailOptions);
        console.log("Admin email sent successfully")
        
        // Send auto-reply to student
        await transporter.sendMail(studentMailOptions);
        console.log("Student auto-reply sent successfully");
        return { success: true };
    }catch (error) {
        console.error("Email sending failed:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = sendInquiryEmail;
