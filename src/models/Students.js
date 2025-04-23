const mongoose = require("mongoose");

const StudentsSchema = new mongoose.Schema({
    studentName: {
        type: String,
        
    },
    gender: {
        type: String,
        
        enum: ["male", "female", "Others"],
    },
    parentName: {
        type: String,
         
    },
    relation: {
        type: String,
        
    },
    class: {
        type:String,
        
    },
    section: {
        type: String,
        
        enum: ["a", "b", "c", "d", "e"],
    },
    address: {
        type: String,
        
    },
    city: {
        type: String,
        
    },
    dateofbirth: {
        type: Date, // Changed from String to Date
        
    },
    email: {
        type: String,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Email validation
    },
    mobile: {
        type: String,
        unique: true,
        match: [/^\d{10}$/, "Mobile number should be 10 digits"], // Mobile validation
    },
    password:
    {
        type: String,
        
    },
    ProfilePicture:
    {
      type:String,
    },
},
{
  timestamps:true
});

module.exports = mongoose.model("Student", StudentsSchema);
