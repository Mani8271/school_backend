const mongoose = require("mongoose");

const systemUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    
    trim: true,
    minLength: 4,
    maxLength: 50
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
  },
  mobileNumber: {
    type: Number,
    
    unique:true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // Ensures a 10-digit number
      },
      message: "Invalid mobile number format.",
    },
  },
  userTitle: {
    type: String,
    enum: ["Mr", "Mrs", "Miss"], // Only allow specific titles
  },
  address: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["Super Admin", "Admin"], // Only allow Super Admin and Admin
  },
  status: {
    type: String,
    enum: ["Active", "Inactive","Pending"], // Only allow Active and Inactive
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
    
  },
},
{ timestamps: true }
);

const systemUserModel = mongoose.model("SystemUsers", systemUserSchema);
module.exports = systemUserModel;
