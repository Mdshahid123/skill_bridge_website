// importing a module
// load env variables
require("dotenv").config()
const path=require("path")
const express=require("express")
const adminRoutes=require("./routes/adminRoutes")
const studentRoutes=require("./routes/studentsRoutes")
const { default: mongoose } = require("mongoose")
const app=express()

// setup ejs
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

// middleware 3: parsing the form data
app.use(express.urlencoded({ extended: true }))//form data is sent in key=value&key=value format and this middleware will parse it and make it available in req.body
app.use(express.json())//for parsing json data sent in request body and make it available in req.body

// middleware 1:serving a static files(css,js,images) from the public folder
app.use(express.static("public"))//it also validate the requested file path 

// middleware 2:matching the reuqested routes in studentroutes otherwise call the next
app.use(studentRoutes)

// middleware 2:matching the reuqested routes in adminroutes otherwise call the next
app.use(adminRoutes)

//server and mongodb connection
const db_path =process.env.mongodb_cloud
const port=process.env.port || 3000
mongoose.connect(db_path).then(()=>{
     console.log("mongodb connected successfully")
     app.listen(port,()=>{
          console.log(`server is running at port ${port}`)
     })
}).catch((error)=>{
      console.log(error)  
})



