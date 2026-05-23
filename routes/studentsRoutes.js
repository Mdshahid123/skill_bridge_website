const express=require("express")
const {showHomePage,showCourses,viewCourseDetails,storeEnqueryForm,getEnqueryForm,showAboutPage,showContactPage,searchCoursesAPI}=require("../controllers/studentControllers")
const routes=express.Router()
routes.get("/",showHomePage)
routes.get("/courses",showCourses)
routes.get("/viewCourse/:courseId",viewCourseDetails)
routes.get("/enqueryForm",getEnqueryForm)
routes.post("/submitEnquery",storeEnqueryForm)
routes.get("/about",showAboutPage)
routes.get("/contact",showContactPage)
// GET /api/courses/search?q=keyword
routes.get('/api/courses/search', searchCoursesAPI);
module.exports=routes



