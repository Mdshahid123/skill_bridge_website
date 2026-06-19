const express=require("express")
const path = require('path');
const {showHomePage,showCourses,viewCourseDetails,storeEnqueryForm,getEnqueryForm,showAboutPage,showContactPage,searchCoursesAPI,getCoursesByCategory,viewClassroomDetails,viewOnlineDetails}=require("../controllers/studentContollers/studentControllers")
const studentRoutes=express.Router()


studentRoutes.get("/",showHomePage)
studentRoutes.get("/courses",showCourses)
studentRoutes.get("/viewCourse/:courseId",viewCourseDetails)
studentRoutes.get("/enqueryForm",getEnqueryForm)
studentRoutes.post("/submitEnquery",storeEnqueryForm)
studentRoutes.get("/about",showAboutPage)
studentRoutes.get("/contact",showContactPage)
studentRoutes.get('/api/courses/search', searchCoursesAPI);
studentRoutes.get('/favicon.ico', (req, res) => {
  console.log("fevicon")
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});


// Classroom program detail page
studentRoutes.get('/viewClassroom/:courseId', viewClassroomDetails);
// Online live program detail page
studentRoutes.get('/viewOnline/:courseId', viewOnlineDetails);


// Category page – must be placed before any route with a parameter like /:id
studentRoutes.get('/courseCatogry', getCoursesByCategory);
module.exports=studentRoutes


studentRoutes.get('/olodl', (req, res) => {
    res.render('pages/student/olodl', { isLogin: req.session?.isLogin || false, user: req.session?.user || null });
});


studentRoutes.get('/placement-career', (req, res) => {
    res.render('pages/student/placement-career', { isLogin: req.session?.isLogin || false, user: req.session?.user || null });
});


// Diploma page
studentRoutes.get('/diploma/data-science', (req, res) => {
    res.render('pages/diploma/data-science', {
        isLogin: req.session?.isLogin || false,
        user: req.session?.user || null,
        title: 'Diploma in Data Science – SkillBridge'
    });
})

// Diploma in Web Development
studentRoutes.get('/diploma/web-development', (req, res) => {
    res.render('pages/diploma/web-development', {
        isLogin: req.session?.isLogin || false,
        user: req.session?.user || null,
        title: 'Diploma in Web Development – SkillBridge'
    });
});


// Diploma in Digital Marketing with AI
studentRoutes.get('/diploma/digital-marketing', (req, res) => {
    res.render('pages/diploma/digital-marketing', {
        isLogin: req.session?.isLogin || false,
        user: req.session?.user || null,
        title: 'Diploma in Digital Marketing with AI – SkillBridge'
    });
});



// Diploma in Cloud Computing & Cyber Security
studentRoutes.get('/diploma/cloud-security', (req, res) => {
    res.render('pages/diploma/cloud-security', {
        isLogin: req.session?.isLogin || false,
        user: req.session?.user || null,
        title: 'Diploma in Cloud Computing & Cyber Security – SkillBridge'
    });
});


// Diploma in Ethical Hacking & Cyber Security
studentRoutes.get('/diploma/ethical-hacking', (req, res) => {
    res.render('pages/diploma/ethical-hacking', {
        isLogin: req.session?.isLogin || false,
        user: req.session?.user || null,
        title: 'Diploma in Ethical Hacking & Cyber Security – SkillBridge'
    });
});


//Diploma in Computer Networking & Cyber Security
studentRoutes.get('/diploma/networking-security', (req, res) => {
    res.render('pages/diploma/networking-security', {
        isLogin: req.session?.isLogin || false,
        user: req.session?.user || null,
        title: 'Diploma in Computer Networking & Cyber Security – SkillBridge'
    });
});


// Diploma in Networking and Cloud AI
studentRoutes.get('/diploma/networking-cloud-ai', (req, res) => {
    res.render('pages/diploma/networking-cloud-ai', {
        isLogin: req.session?.isLogin || false,
        user: req.session?.user || null,
        title: 'Diploma in Networking and Cloud AI – SkillBridge'
    });
});