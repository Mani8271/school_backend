const mongoose = require("mongoose");

const ComplaintsSchema = new mongoose.Schema(
    {
        Teachername: {  
            type: String, 
            
        },
        studentid: {
            type: String,
            
        },
        studentname:
        {
            type: String, 
            
        },
        class: {
            type: String,
            
        },
        section: {
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

module.exports = mongoose.model("Teachercomplaints", ComplaintsSchema);