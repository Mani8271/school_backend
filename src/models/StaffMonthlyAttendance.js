const mongoose = require("mongoose");
const StaffMonthlyAttendanceSchema = new mongoose.Schema(
    {
        name:{
            type:String,
           
        },
        designation:
        {
            type:String, 
           
        },
        email:
        {
            type:String,
            unique:true
            
        },
        mobile:
        {
            type:String,
            unique:true
            
        },
        presents:
        {
            type:String,
            
        },
        absents:
        {
            type:String,
            
        },
        leave:
        {
            type: String,
            
        },
        holidays:
        {
            type: String,
            
        },
        day:
        {
            type: String,
            
        },
        date:
        {
            type: String,
             
        },
        attendance: {
            type: String,
            
            enum: ["Present", "Absent"], // Only allow Active and Inactive
          },
    },
    { timestamps: true }
)

module.exports = mongoose.model("StaffMonthlyAttendance",StaffMonthlyAttendanceSchema);
