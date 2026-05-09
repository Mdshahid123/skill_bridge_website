const express=require("express")
const path=require("path")
const routes=express.Router()
routes.get("/",(req,res)=>{
     const filePath=path.join(__dirname,"../view/","home.html")
     res.sendFile(filePath,(error)=>{
        if(error)
        {
          res.send("something wen wrong please try later")
        }
     }) 
})
routes.get("/courses",(req,res)=>{
         const filePath=path.join(__dirname,"./view/","courses.html")
     res.sendFile(filePath,(error)=>{
        if(error)
        {
          res.send("something wen wrong please try later")
        }
     })  
})


routes.get("/viewCourse",(req,res)=>{

          const filePath=path.join(__dirname,"./view/","viewCourse.html")
          res.sendFile(filePath,(error)=>{
          if(error)
          {
               res.send("something wen wrong please try later")
          }
          }) 

        
})
module.exports=routes



