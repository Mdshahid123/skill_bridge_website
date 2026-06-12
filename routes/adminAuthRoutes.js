const express = require("express");
const { showAdminLogin, submitAdminLogin, adminLogout,adminSignup,submitAdminSignup } = require("../controllers/authControllers/adminAuthControllers");
const adminStudentRoutes = express.Router();
const { isAdmin } = require('../middleware/adminAuth'); // Middleware to protect admin routes

console.log("admin auth routes loaded")



//Public admin login route (no authentication required)
adminStudentRoutes.get('/admin/login', showAdminLogin);
adminStudentRoutes.post('/admin/submitLogin', submitAdminLogin);
adminStudentRoutes.get('/admin/logout', adminLogout);
adminStudentRoutes.get("/admin/signUp",adminSignup);
adminStudentRoutes.post("/admin/submitSignup",submitAdminSignup)

module.exports = adminStudentRoutes;

