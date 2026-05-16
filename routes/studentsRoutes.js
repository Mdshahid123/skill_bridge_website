const express=require("express")
const {showHomePage,showCourses, viewCourses,storeEnqueryForm,getEnqueryForm,showAboutPage,showContactPage}=require("../controllers/studentControllers")
const routes=express.Router()
routes.get("/",showHomePage)
routes.get("/courses",showCourses)
routes.get("/viewCourse/:courseId",viewCourses)
routes.get("/enqueryForm",getEnqueryForm)
routes.post("/submitEnquery",storeEnqueryForm)
routes.get("/about",showAboutPage)
routes.get("/contact",showContactPage)
module.exports=routes



