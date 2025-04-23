const mongoose = require("mongoose");

const AssignHomeworkSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            
        },
        assignedDate: {  // ✅ Renamed to avoid conflict
            type: Date,
            default: Date.now,
            
        },
        title: {
            type: String,
            
        },
        homeworkfile: {
            type: String,
            
        },
        class: {
            type: String,
            
        },
        section: {
            type: String,
            
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("AssignHomeworks", AssignHomeworkSchema);
