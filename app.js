// importing a module
const path=require("path")
const express=require("express")
const studentRoutes=require("./routes/studentsRoutes")
const app=express()

// setup ejs
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
// adding middlware 
// middleware 3: parsing the form data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// middleware 1:serving a static files(css,js,images) from the public folder
app.use(express.static("public"))//it also validate the requested file path 

// middleware 2:matching the reuqested routes in studentroutes otherwise call the next
app.use(studentRoutes)

const port=3000
app.listen(port,()=>{
     console.log(`server is listning at ${port}`)
})

