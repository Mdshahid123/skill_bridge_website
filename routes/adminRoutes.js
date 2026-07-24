const express = require("express");
const adminRoutes = express.Router();
const upload = require("../middleware/upload");

const {
    adminDashboard,
    storeCourses,
    getApiAllCourses,
    deleteApiCourse,
    getEditCourseForm,
    updateCourse,
    getAddCourseForm,
} = require("../controllers/adminContollers/adminControllers");


const { isAdmin } = require('../middleware/adminAuth'); // we'll create this next


//All routes below require admin authentication
adminRoutes.use(isAdmin);

//Your existing protected admin routes
adminRoutes.get("/admin/courses", adminDashboard);
adminRoutes.get("/admin/courses/add", getAddCourseForm);
adminRoutes.post("/storeCourses", upload.any(), storeCourses);
adminRoutes.get("/api/admin/courses", getApiAllCourses);
adminRoutes.delete("/api/admin/courses/:id", deleteApiCourse);
adminRoutes.get("/admin/courses/edit/:id", getEditCourseForm);
adminRoutes.post("/admin/courses/update/:id", upload.any(), updateCourse);

//Optional: keep the old secret route for backward compatibility (but redirect)
adminRoutes.get("/saraShahidNazia", (req, res) => res.redirect('/admin/login'));
module.exports = adminRoutes;