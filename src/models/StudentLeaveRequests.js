const mongoose = require("mongoose");

const StudentLeaveRequestSchema = new mongoose.Schema(
    {
        type:{
            type: String,
            
        },
        startDate: {
            type: Date,
           
        },
        endDate: {
            type: Date,
           
        },
        Days:
        {
           type:Number,
          
        },
        status:
        {
           type: String,
           default:"Pending",
           enum:["Approved","Pending","Rejected"]
        },
        purpose:
        {
          type:String,
         
        }
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.model("StudentLeaveRequests", StudentLeaveRequestSchema);
