const mongoose = require("mongoose");

const UploadHomeworkSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            default: Date.now,
            
        },
        subject:
        {
          type:String,
          
        },
        homeworkfile:
        {
            type:String,
            
        },
        status:
        {
            type:String,
            default:"pending",
            enum:["submitted","pending"]
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("StudentHomeworks", UploadHomeworkSchema);
