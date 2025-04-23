const mongoose = require("mongoose");

const ComplaintsSchema = new mongoose.Schema(
    {
        from: {  
            type: String, 
            
        },
        to:
        {
            type: String, 
            
        },
        description: {
            type: String,
            
        },
        Date: {
            type: Date,
            default: Date.now // Automatically sets the current date and time
        },
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("Complaints", ComplaintsSchema);
