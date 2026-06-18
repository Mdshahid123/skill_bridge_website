const sendInquiryEmail = require('../../utils/sendEmails');
const courseModel=require("../../models/coursesModel")
const path = require("path");



function showHomePage(req, res) {
    console.log("=== HOME PAGE DEBUG ===");
    console.log("Session ID:", req.session.id);
    console.log("isLogin:", req.session?.isLogin);
    console.log("User:", req.session?.user);

    const isLogin = req.session?.isLogin || false;
    const user = req.session?.user || null;

    courseModel.find()
        .then((registerCourses) => {
            // ✅ Pass the courses to the view
            res.render("pages/student/home", {
                registerCourses: registerCourses,   // <-- added
                isLogin: isLogin,
                user: user
            });
        })
        .catch((error) => {
            console.error("Error fetching courses:", error);
            // On error, still render with empty array
            res.render("pages/student/home", {
                registerCourses: [],
                isLogin: isLogin,
                user: user
            });
        });
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
        const courseName= req.params.courseId;
        
        const course = await courseModel.findOne({
            _id: courseName
        });
        
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


// GET /courseCatogry
 
async function getCoursesByCategory(req, res) {
    try {
        const { category } = req.query;   // only category, ignore courseName
        console.log("Category filter:", category);
        
        let filter = {};
        
        if (category && category.trim() !== '') {
            const decodedCategory = decodeURIComponent(category);
            filter.category = { $regex: new RegExp(`^${decodedCategory}$`, 'i') };
        }
        
        // Fetch only courses matching the category (or all if no category)
        const registerCourses = await courseModel.find(filter).sort({ createdAt: -1 });
        
        console.log(`Found ${registerCourses.length} courses for category: ${category || 'all'}`);
        
        res.render('pages/student/courseCatogry', {
            registerCourses: registerCourses,
            selectedCategory: category || 'all',
            searchTerm: '',              // empty because search is client‑side
            errorMessage: null,
            isLogin: req.session?.isLogin || false,
            user: req.session?.user || null
        });
    } catch (error) {
        console.error('Error in getCoursesByCategory:', error);
        res.status(500).render('pages/student/courseCatogry', {
            registerCourses: [],
            selectedCategory: 'all',
            searchTerm: '',
            errorMessage: 'Unable to load courses. Please try again later.',
            isLogin: req.session?.isLogin || false,
            user: req.session?.user || null
        });
    }
}



// ========== VIEW CLASSROOM PROGRAM DETAILS ==========
async function viewClassroomDetails(req, res) {
    console.log("📚 viewClassroomDetails called with params:", req.params);
    const isLogin = req.session?.isLogin || false;
    const user = req.session?.user || null;
    
    try {
        const courseId = req.params.courseId;
        
        const course = await courseModel.findOne({
            $or: [
                { _id: courseId },
                { courseName: courseId }
            ]
        });
        
        if (!course) {
            // If you have a 404.ejs view, use: res.status(404).render('pages/student/404', { message: 'Classroom program not found', isLogin, user });
            // Otherwise, send a simple error message.
            res.status(404).render('pages/student/404', { message: 'Classroom program not found', isLogin, user });
        }
        
        const classroomCourse = {
            ...course.toObject(),
            mode: 'classroom',
            price: course.classroomPrice || 45000,
            originalPrice: course.classroomOriginalPrice || 65000,
            duration: course.classroomDuration || course.duration || 6,
            description: course.classroomDescription || course.courseDescription,
            features: [
                'On‑Campus Learning',
                'Group Collaboration',
                'Lab Access',
                'Instructor‑led Sessions'
            ]
        };
        
        res.render('pages/student/viewClassroom', { 
            course: classroomCourse,
            isLogin,
            user
        });
        
    } catch (error) {
        console.error('Error loading classroom program:', error);
        res.status(500).send('Unable to load classroom program details');
    }
}

// ========== VIEW ONLINE LIVE PROGRAM DETAILS ==========
async function viewOnlineDetails(req, res) {
    console.log("💻 viewOnlineDetails called with params:", req.params);
    const isLogin = req.session?.isLogin || false;
    const user = req.session?.user || null;
    
    try {
        const courseId = req.params.courseId;
        
        const course = await courseModel.findOne({
            $or: [
                { _id: courseId },
                { courseName: courseId }
            ]
        });
        
        if (!course) {
            return res.status(404).send('Online live program not found');
        }
        
        const onlineCourse = {
            ...course.toObject(),
            mode: 'online',
            price: course.onlinePrice || 35000,
            originalPrice: course.onlineOriginalPrice || 55000,
            duration: course.onlineDuration || course.duration || 6,
            description: course.onlineDescription || course.courseDescription,
            features: [
                'Live Interactive Classes',
                'Flexible Timing',
                'Recorded Backup',
                'Virtual Access'
            ]
        };
        
        res.render('pages/student/viewOnline', { 
            course: onlineCourse,
            isLogin,
            user
        });
        
    } catch (error) {
        console.error('Error loading online live program:', error);
        res.status(500).send('Unable to load online live program details');
    }
}
module.exports = {
    viewCourseDetails,
    showHomePage,
    showCourses,
    storeEnqueryForm,
    getEnqueryForm,
    showAboutPage,
    showContactPage,
    searchCoursesAPI,
    getCoursesByCategory,
    viewClassroomDetails,   
    viewOnlineDetails, 
}