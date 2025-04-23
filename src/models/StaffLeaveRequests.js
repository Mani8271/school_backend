const mongoose = require("mongoose");
const StaffLeavesSchema = new mongoose.Schema(
    {
        name:{
            type:String,
           
        },
        type:
        {
            type:String, 
            
        },
        from:
        {
            type:String,
            
        },
        to:
        {
            type:String,
            
        },
       days:
        {
            type:String,
            
        },
        reason:
        {
            type:String,
            
        },
        status: {
            type: String,
            enum: ["Approved", "Pending","Rejected"], // Only allow Active and Inactive
          },
    },
    { timestamps: true }
)

module.exports = mongoose.model("StaffLeavesSchema",StaffLeavesSchema);
