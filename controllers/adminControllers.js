const courseModel=require("../models/coursesModel")

//show admin login
function showAdminLogin(req,res){
    console.log("i am admin login")
    res.render("pages/adminLogin")
}

//store courses
function storeCourses(req,res)
{

        const courseData=req.body
        const files=req.files
        console.log("course data",courseData)
        console.log("files",files)

}

// show admin dashboard
function adminDashboard(req,res)
{
     res.render("pages/adminDashboard")
}

module.exports={
  showAdminLogin,
  adminDashboard,
  storeCourses
}
