const mongoose =require("mongoose")
const coursesSchema=new mongoose.Schema({
       courseName: {type:String,required:true},
       category:{type:String,required:true}, 
       level:{type:String,required:true,enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }, 
       duration:{type:Number,required:true}, 
       price:{type:Number,required:true}, 
       originalPrice:{type:Number,required:true}, 
       image:{type:String,required:true},
       description:{type:String,required:true},
       whatYouLearn:String,
       requirements:String
},{ timestamps: true });

module.exports=mongoose.model("coursesModel",coursesSchema)






