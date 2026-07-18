const express=require("express")
const ondCoursesRoutes=express.Router()


ondCoursesRoutes.get("/OnlineMba",(req,res)=>{

      res.render('pages/online_distance/OnlineCourses/OnlineMba', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})


module.exports=ondCoursesRoutes

