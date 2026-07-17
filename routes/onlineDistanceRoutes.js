const express=require("express")
const ondRoutes=express.Router()

console.log("hello jain")
ondRoutes.get("/AmityUniversity",(req,res)=>{
      res.render('pages/online_distance/amityUnversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null });     
})

ondRoutes.get("/JainUniversity",(req,res)=>{
  console.log("jain")
      res.render('pages/online_distance/jainUnversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})

module.exports=ondRoutes

