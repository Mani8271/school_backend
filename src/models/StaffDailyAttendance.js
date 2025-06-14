const mongoose = require("mongoose");
const StaffDailyAttendanceSchema = new mongoose.Schema(
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
        attendance: {
            type: String,
            
            enum: ["Present", "Absent"], // Only allow Active and Inactive
          },
          subject: {
            type: String,
      
          },
             date: {
      type: String, // Store date as 'YYYY-MM-DD' string for easy querying
      default: () => new Date().toISOString().split("T")[0],
    },
           staffType: {
      type: String,
      required: true,
      enum: ["Teaching", "Non-Teaching"], // ✅ Add this
    },
    },
    { timestamps: true }
)

module.exports = mongoose.model("StaffDailyAttendance",StaffDailyAttendanceSchema);
