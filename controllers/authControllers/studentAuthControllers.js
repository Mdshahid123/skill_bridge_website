const { check, validationResult } = require("express-validator");
const user = require("../../models/userModel")
const bcrypt = require("bcryptjs")

//--------- login related routes----------------------//

// get login 

function getLogin(req,res){
     res.render("pages/auth/student/login")
}


// Submit login handler
async function submitLogin(req, res) {
    const { email, password } = req.body;

    try {
        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(401).render("pages/auth/student/login", {
                error: "Invalid email or password",
                email: email
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordValid) {
            return res.status(401).render("pages/auth/student/login", {
                error: "Invalid email or password",
                email: email
            });
        }

        // Create a plain object for session storage
        const userData = {
            _id: existingUser._id.toString(),
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            role: existingUser.role || "user"
        };

        // Store data in session
        req.session.isLogin = true;
        req.session.user = userData;

        // Save session before redirecting
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);

                return res.status(500).render("pages/auth/student/login", {
                    error: "An error occurred while logging in. Please try again",
                    email: email
                });
            }

            console.log("✅ Session created successfully!");
            console.log("Session ID:", req.session.id);
            console.log("User data stored:", req.session.user);

            res.redirect("/");
        });

    } catch (error) {
        console.error("Error during login:", error);

        res.status(500).render("pages/auth/student/login", {
            error: "An error occurred while logging in. Please try again.",
            email: email
        });
    }
}




//logout user
function logout(req,res){

     req.session.destroy((err)=>{ //it will destroy the session and remove the session cookie from the browser
          if(err){
               console.log(err)
          }
          res.redirect("/")
     })
}

// -------------------------sign up related routes-----------------------------

const getSignUp=(req,res)=>{
     res.render("pages/auth/student/signup",{isLogin:false,error:false})
}


const submitSignUp= [
// fist name validation
check("firstName")
     .trim()
     .notEmpty()
     .withMessage("First name is required")
     .isLength({ min: 2 })
     .withMessage("First name must be at least 2 characters long")
     .matches(/^[A-Za-z]+$/)
     .withMessage("First name must contain only letters"),

// last name validation
check("lastName")
     .notEmpty()
     .withMessage("Last name is required")
     .trim()
     .isLength({ min: 3 })
     .withMessage("Last name must be at least 3 characters long")
     .matches(/^[A-Za-z]+$/)
     .withMessage("Last name must contain only letters"),

// email validation
check("email")
     .notEmpty()
     .withMessage("Email is required")
     .isEmail()
     .withMessage("Invalid email format"),

//password validation
check("password")
     .notEmpty()
     .withMessage("Password is required")
     .isLength({ min: 6 })
     .withMessage("Password must be at least 6 characters long")
     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
     .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),

// confirm password validation
check("confirmPassword")
     .notEmpty()
     .withMessage("Confirm password is required")
     .custom((value, { req }) => {
          if (value !== req.body.password) {
               throw new Error("Passwords do not match");
          }
          return true;
     }),



//check terms and conditions 
check("terms")
     .equals("accepted")
     .withMessage("You must accept the terms and conditions"),

   async (req,res)=>{
   console.log("Received signup data:", req.body);
   const error = validationResult(req)
     if(!error.isEmpty()){
        return res.status(422).render("pages/auth//student/signup",{
                isLogin:false,
                error:error.array()[0].msg,
        })
     }

     try{
    

     //hash password before saving to database
     const hashedPassword = await bcrypt.hash(req.body.password, 12);
     req.body.password=hashedPassword

     //save to database
     const newUser = new user(req.body);
     await newUser.save();
     console.log("User registered successfully");
     res.redirect("/login");

     }catch(err){

         if(err.code === 11000){
          return res.status(422).render("pages/auth/student/signup",{
               isLogin:false,
               error:"An account with this email already exists. Please log in. "
          });
     }
     console.log("Error during user registration:", err);
     res.status(500).render("pages/auth/student/signUp",{isLogin:false,error:"An error occurred while registering. Please try again."})
    }
}
]

//--------------------------exporting the function---------------------------------------//

module.exports={
  getLogin,
  submitLogin,
  logout,
  getSignUp,
  submitSignUp
}

