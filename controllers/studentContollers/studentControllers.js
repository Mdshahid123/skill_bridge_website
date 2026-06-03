const sendInquiryEmail = require('../../utils/sendEmails');
const courseModel=require("../../models/coursesModel")
const path = require("path");

//show home page
function showHomePage(req, res) {
// ✅ Add this debug log
    console.log("=== HOME PAGE DEBUG ===");
    console.log("Session ID:", req.session.id);
    console.log("isLogin:", req.session?.isLogin);
    console.log("User:", req.session?.user);

 res.render("pages/student/home", {isLogin:req.session?.isLogin || false,user:req.session?.user || null});
            

}

//show courses - FIXED

//Controller - keep as registerCourses
function showCourses(req, res) {  
    courseModel.find().then((registerCourses) => {
        const isLogin=req.session?.isLogin || false
        const user=req.session?.user || null
        res.render("pages/student/courses", { registerCourses: registerCourses, isLogin, user });
    }).catch((error) => {
        console.log(error);
        res.render("pages/student/courses", { registerCourses: [], isLogin, user });
    });
}

// view course details
async function viewCourseDetails(req, res) {
    console.log(req.params)
     const isLogin=req.session?.isLogin || false
    const user=req.session?.user || null
    try {
        const courseId = req.params.courseId;
        const course = await  courseModel.findById(courseId);
        
        if (!course) {
            return res.status(404).send('Course not found');
        }
     res.render('pages/student/viewCourse', { course, isLogin, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading course');
    }
}

// show about page
function showAboutPage(req, res) {
    const isLogin=req.session?.isLogin || false
    const user=req.session?.user || null
    res.render("pages/student/about", { isLogin, user });
}

// show contact page
function showContactPage(req, res) {
    const isLogin=req.session?.isLogin || false
    const user=req.session?.user || null
    res.render("pages/student/contact", { isLogin, user });
}


// store enquery form

function storeEnqueryForm(req, res) {
     
    // print the form data 
     console.log("Received form data:", req.body);

    //getting form data from request body
     const { name, email, phoneNumber, course, message,degree,callbackTime } = req.body;

    //Basic validation
     if (!name || !email || !phoneNumber || !course) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    //Additional validation for phone number and email format
    if (!/^\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
  
   res.status(200).json({success: true, message: "Your inquiry has been received. We will contact you soon!"});


    //step-02  Send email in background
    sendInquiryEmail(req.body).then(result => {
        if (result.success) {
            console.log("Emails sent successfully");
        } else {
            console.error("Failed to send emails:", result.error);
        }
    }).catch(error => {
        console.error("Email error:", error.message);
    });

 }







//get enquery form
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