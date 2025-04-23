const mongoose = require("mongoose");

const BusStaffSchema = new mongoose.Schema(
    {
        role: {
            type: String,
           
            enum: ["Driver", "Conductor"]
        },
        name: {
            type: String,
           
            trim: true
        },
        dateofBirth: {
            type: Date,  // Changed from String to Date
           
            validate: {
                validator: function (value) {
                    return value < new Date(); // Ensures date is in the past
                },
                message: "Date of Birth must be a past date"
            }
        },
        license: {
            type: String,
           
            trim: true,
            match: /^[A-Z0-9-]{6,15}$/ // Adjust regex as per license format
        },
        contact: {
            type: String,
           
            unique: true,
            match: /^[0-9]{10}$/ // Ensures valid 10-digit phone number
        },
        vehicle: {
            type: String,
           
            trim: true
        },
        route: {
            type: String,
           
            trim: true
        },
        profilePhoto: {
            type: String,
           
        },
        licensePhoto: {
            type: String,
           
        },
        email:
        {
            type: String,
            
        },
        password:
        {
            type: String,
           
        }
    },
    {
      timestamps:true
    }
);

module.exports = mongoose.model("BusStaff", BusStaffSchema);
