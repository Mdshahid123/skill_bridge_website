const express=require("express")
const path = require('path');
const {showHomePage,showCourses,viewCourseDetails,storeEnqueryForm,getEnqueryForm,showAboutPage,showContactPage,searchCoursesAPI}=require("../controllers/studentContollers/studentControllers")
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
module.exports=studentRoutes



