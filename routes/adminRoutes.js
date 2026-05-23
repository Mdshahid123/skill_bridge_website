const express = require("express");
const adminRoutes = express.Router();
const upload = require("../middleware/upload");
const {
    showAdminLogin,
    adminDashboard,
    storeCourses,
    getApiAllCourses,
    deleteApiCourse,
    getEditCourseForm,
    updateCourse,
    getAddCourseForm
} = require("../controllers/adminControllers");

// Existing routes
adminRoutes.get("/adminLogin", showAdminLogin);
adminRoutes.get("/admin/courses", adminDashboard);
adminRoutes.post("/storeCourses", upload.any(), storeCourses);

// API routes (AJAX)
adminRoutes.get("/api/admin/courses", getApiAllCourses);
adminRoutes.delete("/api/admin/courses/:id", deleteApiCourse);

// Form routes
adminRoutes.get("/admin/courses/add", getAddCourseForm);
adminRoutes.get("/admin/courses/edit/:id", getEditCourseForm);
adminRoutes.post("/admin/courses/update/:id", upload.any(), updateCourse);

module.exports = adminRoutes;