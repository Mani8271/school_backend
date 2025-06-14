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
           staffType: {
      type: String,
      required: true,
      enum: ["Teaching", "Non-Teaching"], // ✅ Add this
    },
    },
    { timestamps: true }
)

module.exports = mongoose.model("StaffDailyAttendance",StaffDailyAttendanceSchema);
