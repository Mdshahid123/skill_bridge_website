const courseModel = require("../../models/coursesModel");
const Admin = require('../../models/adminModel');
const bcrypt = require('bcryptjs');
const fs = require("fs");
const path = require("path");

console.log("admin auth controllers loaded")
// Show admin login page
function showAdminLogin(req, res) {

    res.render('pages/auth/admin/adminLogin');
}



//Handle admin login POST request
async function submitAdminLogin(req, res) {

    const { email, password, remember } = req.body;

    console.log("admin auth controllers")

    // Basic input validation
    if (!email || !password) {
        console.log("email and password is rquesred")
        return res.status(400).render('pages/auth//admin/adminLogin', {
            error: 'Email and password are required.',
            email: email || ''
        });
    }


    try {

        // Find admin by email (case‑insensitive)
        const admin = await Admin.findOne({ email: email.toLowerCase() });

        // Admin not found
        if (!admin) {
            // Simulate a small delay to prevent timing attacks
            await new Promise(resolve => setTimeout(resolve, 500));
            return res.status(401).render('pages/auth/admin/adminLogin', {
                error: 'Invalid email or password.',
                email: email
            });
        }

        // Check if account is locked
        if (admin.lockUntil && admin.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / 60000);
            return res.status(403).render('pages/auth/admin/adminLogin', {
                error: `Account is locked. Try again after ${minutesLeft} minutes.`,
                email: email
            });
        }

    //     // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            // Increment login attempts
            await admin.incLoginAttempts();
            const remainingAttempts = 5 - (admin.loginAttempts + 1);
            const errorMsg = remainingAttempts > 0
                ? `Invalid password. ${remainingAttempts} attempt(s) left.`
                : 'Too many failed attempts. Account locked for 2 hours.';
            return res.status(401).render('pages/auth/admin/adminLogin', {
                error: errorMsg,
                email: email
            });
        }

        // Successful login – reset attempts and lock
        await Admin.updateOne(
            { _id: admin._id },
            {
                $set: {
                    loginAttempts: 0,
                    lockUntil: null,
                    lastLogin: new Date(),
                    lastLoginIP: req.ip || req.connection.remoteAddress
                }
            }
        );

        // Create session with admin data (never store the password)
        req.session.isAdmin = true;
        req.session.admin = {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        };

        // Optional: set session cookie maxAge based on "remember me"
        if (remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 day
        }

        // Save session and redirect to admin dashboard
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).render('pages/auth/admin/adminLogin', {
                    error: 'Server error. Please try again.',
                    email: email
                });
            }
            res.redirect('/admin/courses');
        });

    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).render('pages/auth/admin/adminLogin', {
            error: 'An internal error occurred. Please try again later.',
            email: email
        });
    }
}

//Admin logout
function adminLogout(req, res) {
    req.session.destroy(err => {
        if (err) console.error('Logout error:', err);
        res.redirect('/admin/login');
    });
}


// ----------------------------------------------------------------------------------------------------------------------//

function adminSignup(req,res)
{
          res.render("pages/auth/admin/adminSignUp", {
        admin: "false",
        error: null,
        success: null,
        formData: null,
        csrfToken: "ddf4545"//req.csrfToken()  // we'll implement CSRF later, but placeholder
    })
}

// controllers/adminController.js

// ... existing code (adminDashboard, storeCourses, etc.)

// CREATE a new admin (only accessible by existing admins)
async function submitAdminSignup(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validation
    if (!name || !email || !password || !confirmPassword) {
        return res.render('pages/admin/adminCreate', {
            admin: req.session.admin,
            error: 'All fields are required.',
            formData: req.body,
            csrfToken: req.csrfToken()
        });
    }

    if (password !== confirmPassword) {
        return res.render('pages/admin/adminCreate', {
            admin: req.session.admin,
            error: 'Passwords do not match.',
            formData: req.body,
            csrfToken: req.csrfToken()
        });
    }



    // Password strength: min 8 chars, at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.render('pages/admin/adminCreate', {
            admin: req.session.admin,
            error: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.',
            formData: req.body,
            csrfToken: req.csrfToken()
        });
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('pages/admin/adminCreate', {
            admin: req.session.admin,
            error: 'Please enter a valid email address.',
            formData: req.body,
            csrfToken: req.csrfToken()
        });
    }

    try {
        // 2. Check if email already exists
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            return res.render('pages/admin/adminCreate', {
                admin: req.session.admin,
                error: 'An admin with this email already exists.',
                formData: req.body,
                csrfToken: req.csrfToken()
            });
        }

        // 3. Create new admin (password will be hashed by pre-save hook)
        const newAdmin = new Admin({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password, // plain password, model will hash it
        });

        await newAdmin.save();

        // 4. Success – redirect to create admin page with success message
        res.render('pages/admin/adminCreate', {
            admin: req.session.admin,
            success: `Admin ${newAdmin.name} (${newAdmin.email}) created successfully.`,
            formData: null,
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        console.error('Error creating admin:', err);
        res.render('pages/admin/adminCreate', {
            admin: req.session.admin,
            error: 'Server error. Could not create admin. Please try again.',
            formData: req.body,
            csrfToken: req.csrfToken()
        });
    }
}

// module.exports = {
//     adminDashboard,
//     storeCourses,
//     getApiAllCourses,
//     deleteApiCourse,
//     getAddCourseForm,
//     getEditCourseForm,
//     updateCourse,
//     createAdmin  // export the new function
// };



module.exports = {
    showAdminLogin,
    submitAdminLogin,
    adminLogout,
    adminSignup,
    submitAdminSignup

}