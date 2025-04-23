const mongoose = require("mongoose");
const StudentsAttendanceSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            
        },
        class:
        {
            type:String, 
        },
        section:
        {
            type:String,
            
        },
        rollNumber:
        {
            type:String,
            
        },
        present:
        {
            type:String,
             
        },
        absent:
        {
            type:String,
             
        },
        onLeave:
        {
            type:String,
             
        }
        ,
        holiday:
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

module.exports = mongoose.model("StudentsAttendance",StudentsAttendanceSchema);
