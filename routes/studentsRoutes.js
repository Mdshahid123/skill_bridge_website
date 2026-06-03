const express=require("express")
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
module.exports=studentRoutes



