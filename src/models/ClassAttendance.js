const mongoose = require("mongoose");
const ClassAttendanceSchema = new mongoose.Schema(
    {
        class:
        {
            type:String, 
            
        },
        section:
        {
            type:String,
            
        },
        year:
        {
            type:String,
             
        },
        month:
        {
            type:String,
             
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("StudentsAttendance",ClassAttendanceSchema);
