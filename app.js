//importing a module
//load env variables
require("dotenv").config()
const path=require("path")
const express=require("express")
const adminRoutes=require("./routes/adminRoutes")
const studentRoutes=require("./routes/studentsRoutes")
const adminAuthRoutes=require("./routes/adminAuthRoutes.js")
const studentAuthRoutes=require("./routes/studentAuthRoutes")
const { default: mongoose } = require("mongoose")
const session=require("express-session")
const mongodbStore=require("connect-mongodb-session")(session)
const app=express()

//setup ejs
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
const store=new mongodbStore({
     uri:process.env.mongodb_cloud,
     collection:"sessions"
})


// middleware 3:parsing the form data
app.use(express.urlencoded({ extended: true }))//form data is sent in key=value&key=value format and this middleware will parse it and make it available in req.body
app.use(express.json())//for parsing json data sent in request body and make it available in req.body

//middleware 1:serving a static files(css,js,images) from the public folder
app.use(express.static(path.join(__dirname, 'public')));//it also validate the requested file path
app.use(session({
     secret: "shahid-akhtar",
     resave: false,
     saveUninitialized:false,
     store:store
}))

//Serve static files
app.use('/uploads', express.static('uploads'));

// middleware 2:matching the reuqested routes in studentroutes otherwise call the next
app.use(studentRoutes)
app.use(studentAuthRoutes)
app.use(adminAuthRoutes)
app.use(adminRoutes)

// middleware 2:matching the reuqested routes in authroutes otherwise call the next


//server and mongodb connection
const db_path =process.env.MONGODB_CLOUD
const port=process.env.PORT || 3000
mongoose.connect(db_path).then(()=>{
     console.log("mongodb connected successfully")
     app.listen(port,()=>{
          console.log(`server is running at port ${port}`)
     })
}).catch((error)=>{
      console.log(error)  
})



