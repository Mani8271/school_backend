const mongoose = require("mongoose");

const NonTeachingStaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      
    },
    department: {
      type: String,
      
    },
    designation: {
      type: String,
      
    },
    gender: {
      type: String,
      
      enum: ["Male", "Female", "Others"],
    },
    experience: {
      type: Number, // ✅ Changed to Number type
      
    },
    joiningDate: {
      type: Date, // ✅ Changed to Date type
      
    },
    maritalStatus: {
      type: String,
      
      enum: ["Unmarried", "Married"],
    },
    emergencyContactNumber: {
      type: String,
      
      match: [/^\d{10}$/, "Emergency contact number should be 10 digits"],
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
    ProfilePicture: {
      type: String, // ✅ Changed to lowercase camelCase
    },
    password:
    {
      type: String,
      
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("NonTeachingStaff", NonTeachingStaffSchema);
