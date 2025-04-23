const mongoose = require("mongoose");

const TeachersSchema = new mongoose.Schema(
  {
    teacherName: {
      type: String,
    },
    subject: {  
      type: String,
    },
    gender: {
      type: String,  
      enum: ["Male", "Female", "Others"],
    },
    qualification: {
      type: String,
    },
    experience: {
      type: String,
    },
    joiningDate: {
      type: String, 
    },
    maritalStatus: { 
      type: String,
      enum: ["unmarried", "married"],
    },
    emergencyContactNumber: { 
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    mobileNumber: {
      type: String,
      unique: true,
      match: [/^\d{10}$/, "Mobile number should be 10 digits"],
    },
    password:
    {
      type: String,
      
    },
    about:
    {
      type:String
    },
    profileImage:
    {
      type:String,
      required:true
    },
    ProfilePicture:
    {
      type:String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Teacher", TeachersSchema); 
