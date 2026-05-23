const sendInquiryEmail = require('../utils/sendEmails');
const courseModel=require("../models/coursesModel")
const path = require("path");

//show home page
function showHomePage(req, res) {
    res.render("pages/home")
}


//show courses - FIXED

//Controller - keep as registerCourses
function showCourses(req, res) {  
    courseModel.find().then((registerCourses) => {
        res.render("pages/courses", { registerCourses: registerCourses });
    }).catch((error) => {
        console.log(error);
        res.render("pages/courses", { registerCourses: [] });
    });
}

// view course details
async function viewCourseDetails(req, res) {
    console.log(req.params)
    try {
        const courseId = req.params.courseId;
        const course = await  courseModel.findById(courseId);
        
        if (!course) {
            return res.status(404).send('Course not found');
        }
     res.render('pages/viewCourse', { course });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading course');
    }
}

// show about page
function showAboutPage(req, res) {
    res.render("pages/about")
}

// show contact page
function showContactPage(req, res) {
    res.render("pages/contact")
}


// store enquery form

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

// get enquery form

function getEnqueryForm(req, res) {
    const filePath = path.join(__dirname, "../views/", "enqueryForm.html") 
    res.sendFile(filePath, (error) => {
        if (error) {
            res.status(500).send("Something went wrong, please try later")
        }
    })
}


/**
 * API endpoint to search courses by name or description
 * Query param: q (search keyword)
 * Returns array of matching courses (limited fields)
 */
const searchCoursesAPI = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.json([]);
        }
        
        const searchTerm = q.trim();
        // Case-insensitive regex search on courseName and courseDescription
        const regex = new RegExp(searchTerm, 'i');
        
        const courses = await courseModel.find({
            $or: [
                { courseName: regex },
                { courseDescription: regex },
                { longDescription: regex }
            ]
        }).select('_id courseName courseDescription image price originalPrice').limit(10);
        
        res.json(courses);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search courses' });
    }
};

module.exports = {
    viewCourseDetails,
    showHomePage,
    showCourses,
    storeEnqueryForm,
    getEnqueryForm,
    showAboutPage,
    showContactPage,
    searchCoursesAPI
}