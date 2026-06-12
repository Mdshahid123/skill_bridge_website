const courseModel = require("../../models/coursesModel");
const Admin = require('../../models/adminModel');
const bcrypt = require('bcryptjs');
const fs = require("fs");
const path = require("path");


//sign up controllers


//signup admin
function adminSignup(req,res)
{
        res.render("pages/auth/admin/adminSignUp",{
         admin: "false",
         error: null,
         success: null,
         formData: null,
         csrfToken: "ddf4545"//req.csrfToken()  // we'll implement CSRF later, but placeholder
    })
}


//handling admin sign up post request
async function submitAdminSignup(req, res) {

    // step-01  getting data 
    const { name, email, password, confirmPassword } = req.body;
    console.log(req.body)

    // step-02 form validation

        // 1. basic Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.render('pages/auth/admin/adminSignUp', {
                admin: req.session.admin,
                error: 'All fields are required.',
                formData: req.body,
                csrfToken:"ddf4545"//req.csrfToken() we will implement later
            });
        }

        //2.Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('pages/auth/admin/adminSignUp', {
                admin: req.session.admin,
                error: 'Please enter a valid email (e.g., user@example.com).',
                formData: req.body,
                csrfToken: "ddf4545"  //req.csrfToken():we will be implement it later
            });
        }


    // 3.matching password validation
        if (password !== confirmPassword) {
            return res.render('pages/auth/admin/adminSignUp', {
                admin: req.session.admin,
                error: 'Passwords do not match.',
                formData: req.body,
                 csrfToken: "ddf4545"    // req.csrfToken();we will implement it later
            });
        }

    //3.Password strength: min 8 chars, at least one uppercase, one lowercase, one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.render('pages/auth/admin/adminSignUp', {
                admin: req.session.admin,
                error: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.',
                formData: req.body,
                csrfToken:  "ddf4545"      //req.csrfToken()//we will implement it later
            });
        }

    // step 3 now we have fimd store the signup data 
    try {


        // 1. Check if email already exists
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            return res.render('pages/auth/admin/adminSignUp', {
                admin: req.session.admin,
                error: 'An admin with this email already exists.please Login',
                formData: req.body,
                csrfToken:  "ddf4545"     //req.csrfToken() : we will implement it later
            });
        }
        
        // 2. Create new admin (password will be hashed by pre-save hook)

        const hashedPassword = await bcrypt.hash(password, 12);
        const newAdmin = new Admin({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });
        
        await newAdmin.save();
         
        // 4. Success – redirect to create admin page with success message
        res.render('pages/auth/admin/adminSignUp', {
            admin: req.session.admin,
            success: `Admin ${newAdmin.name} (${newAdmin.email}) created successfully. please Login`,
            formData: null,
            csrfToken:  "ddf4545"        //req.csrfToken():we will implement it later
        });


       
    }catch(error) {
         
             console.error('Error creating admin:', err);
             res.render('pages/auth/admin/adminSignUp', {
                 admin: req.session.admin,
                 error: 'Opps somthing went wrong Server error. Could not create admin. Please try again.',
                 formData: req.body,
                 csrfToken: "ddf4545"       // req.csrfToken()
             });
    }

}



//login contollers



//Show admin login page

function showAdminLogin(req, res) {

    res.render('pages/auth/admin/adminLogin');
}



//Handle admin login POST request
async function submitAdminLogin(req, res) {
      console.log("admn login form data:",req.body)

    //step-01 getting a login credential
     const { email, password, remember } = req.body;

    //---------validation-------------
     
     //step-01:Basic input validation
         if (!email || !password) {
             return res.status(400).render('pages/auth//admin/adminLogin', {
                 error: 'Email and password are required.',
                 email: email || ''
             });
         }

        //2.Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('pages/auth/admin/adminLogin', {
                error: 'Please enter a valid email (e.g., user@example.com).',
            });
        }

       //step-02:find the that admin from data base(if validation is okay)
       try {
          //  Find admin by email (case‑insensitive)
          const admin = await Admin.findOne({ email: email.toLowerCase() });//give admin object or null
          console.log("fetching admin:",admin)

        // if admin null
          if (!admin) {
                //Simulate a small delay to prevent timing attacks
                await new Promise(resolve => setTimeout(resolve,900));
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
                    
                    // Verify password
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
                    id: admin._id.toString(),
                    email: admin.email,
                    name: admin.name,
                    role: admin.role || "admin"
                };
                // Optional: set session cookie maxAge based on "remember me"

                 if (remember === "on") {
                    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
                } else {
                    req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 day
                }
             

                // 🛑 Clear any existing user session data
                req.session.isLogin = false;
                req.session.user = null;

                //Save session and redirect to admin dashboard
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
            }catch(error){

                console.error('Admin login error:', error);
                res.status(500).render('pages/auth/admin/adminLogin', {
                 error: 'An internal error occurred. Please try again later.',
                 email: email

                })
            }

}

//Admin logout
function adminLogout(req, res) {
    req.session.destroy(err => {
        if (err) console.error('Logout error:', err);
        res.redirect('/admin/login');
    });
}


module.exports = {
    showAdminLogin,
    submitAdminLogin,
    adminLogout,
    adminSignup,
    submitAdminSignup

}