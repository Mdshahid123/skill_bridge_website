const  express = require("express");
const { getLogin ,submitLogin,logout,getSignUp,submitSignUp} = require("../controllers/authControllers/studentAuthControllers");
const studentAuthRoutes = express.Router();


//Existing routes
studentAuthRoutes.get("/Login", getLogin);
studentAuthRoutes.post("/submitLogin", submitLogin);
studentAuthRoutes.get("/logout", logout);
studentAuthRoutes.get("/signup", getSignUp) //new route for signup page
studentAuthRoutes.post("/submitSignup",submitSignUp)


module.exports = studentAuthRoutes;