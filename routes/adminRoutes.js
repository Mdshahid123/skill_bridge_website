const express=require("express")
const {showAdminLogin,adminDashboard,storeCourses}=require("../controllers/adminControllers")
const upload = require('../middleware/upload');  // Import multer middleware
adminRoutes=express.Router()
// ✅ Apply multer middleware to this specific route
adminRoutes.post("/storeCourses", upload.any(), storeCourses);

// Other routes without file upload
adminRoutes.get("/adminLogin",showAdminLogin)
adminRoutes.get("/admin/courses",adminDashboard)

module.exports=adminRoutes
