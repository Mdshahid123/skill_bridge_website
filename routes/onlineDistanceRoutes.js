const express=require("express")
const ondRoutes=express.Router()

console.log("hello jain")
ondRoutes.get("/AmityUniversity",(req,res)=>{
      res.render('pages/online_distance/onlineUniversity/amityUnversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null });     
})

ondRoutes.get("/JainUniversity",(req,res)=>{
  console.log("jain")
      res.render('pages/online_distance/onlineUniversity/jainUnversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})

ondRoutes.get("/chandigarhUniversity",(req,res)=>{
  console.log("jain")
      res.render('pages/online_distance/onlineUniversity/chandigarhUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})

ondRoutes.get("/shardaUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/shardaUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/glaUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/glaUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/manipalUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/manipalUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/uttaranchalUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/uttaranchalUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/GalgotiasUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/GalgotiasUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/BITSPilaniUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/BITSPilaniUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/NIILMUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/NIILMUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/OnlineManipalUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/OnlineManipalUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/AndhraUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/AndhraUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/SikkimManipalUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/SikkimManipalUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/DYPatilVidyapeeth",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/DYPatilVidyapeeth', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})

ondRoutes.get("/MATSUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/onlineUniversity/MATSUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})


// courses Routes
ondRoutes.get("/onlineMba",(req,res)=>{
    
      res.render('pages/online_distance/OnLineCourses/OnlineMba', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})

ondRoutes.get("/onlineBca",(req,res)=>{
    
      res.render('pages/online_distance/OnLineCourses/onlineBca', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})

ondRoutes.get("/onlineBca",(req,res)=>{
    
      res.render('pages/online_distance/OnLineCourses/onlineBca', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/onlineBba",(req,res)=>{
    
      res.render('pages/online_distance/OnLineCourses/onlineBba', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/onlineMca",(req,res)=>{
    
      res.render('pages/online_distance/OnLineCourses/onlineMca', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})

module.exports=ondRoutes

