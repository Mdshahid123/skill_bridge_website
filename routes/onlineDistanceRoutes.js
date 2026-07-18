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

ondRoutes.get("/chandigarhUniversity",(req,res)=>{
  console.log("jain")
      res.render('pages/online_distance/chandigarhUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})

ondRoutes.get("/shardaUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/shardaUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/glaUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/glaUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/manipalUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/manipalUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/uttaranchalUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/uttaranchalUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/GalgotiasUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/GalgotiasUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/BITSPilaniUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/BITSPilaniUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
      console.log("shahid")    
})
ondRoutes.get("/NIILMUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/NIILMUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/OnlineManipalUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/OnlineManipalUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/AndhraUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/AndhraUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/SikkimManipalUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/SikkimManipalUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/DYPatilVidyapeeth",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/DYPatilVidyapeeth', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})
ondRoutes.get("/MATSUniversity",(req,res)=>{
      console.log("jain")
      res.render('pages/online_distance/MATSUniversity', { isLogin: req.session?.isLogin || false, user: req.session?.user || null }); 
        
})


module.exports=ondRoutes

