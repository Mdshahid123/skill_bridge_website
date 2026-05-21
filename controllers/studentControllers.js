const sendInquiryEmail = require('../utils/sendEmails');
const courseModel=require("../models/coursesModel")
const path = require("path");
const coursesModel = require('../models/coursesModel');

//show home page
function showHomePage(req, res) {
    res.render("pages/home")
}


// show courses - FIXED
// Controller - keep as registerCourses
function showCourses(req, res) {  
    courseModel.find().then((registerCourses) => {
        res.render("pages/courses", { registerCourses: registerCourses });
    }).catch((error) => {
        console.log(error);
        res.render("pages/courses", { registerCourses: [] });
    });
}

// view courses
function viewCourses(req, res) {
    
    // You can add logic here later
    res.render("pages/viewCourse")  // Optional: render a view
}

// show about page
function showAboutPage(req, res) {
    res.render("pages/about")
}

function showContactPage(req, res) {
    res.render("pages/contact")
}

function storeEnqueryForm(req, res) {
    console.log("Received form data:", req.body);
    
    // step-01 Redirect with success message immediately
    res.send(`
        <script>
            window.location.href = "/?success=true";
        </script>
    `)

   
 // step-02    Send email in background
            sendInquiryEmail(req.body).then(result => {
                if (result.success) {
                    console.log("Emails sent successfully");
                } else {
                    console.error("Failed to send emails:", result.error);
                }
            }).catch(error => {
                console.error("Email error:", error);
            });
        
       
}

function getEnqueryForm(req, res) {
    const filePath = path.join(__dirname, "../views/", "enqueryForm.html") 
    res.sendFile(filePath, (error) => {
        if (error) {
            res.status(500).send("Something went wrong, please try later")
        }
    })
}

module.exports = {
    showHomePage,
    showCourses,
    viewCourses,
    storeEnqueryForm,
    getEnqueryForm,
    showAboutPage,
    showContactPage
}