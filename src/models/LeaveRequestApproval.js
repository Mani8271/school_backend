const mongoose = require("mongoose");

const LeaveApprovalSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            
        },
        reason: {
            type: String,
        },
        requestedOn: {  
            type: Date, // ✅ Stores both date & time
            
            default: Date.now // ✅ Automatically sets current date & time
        },
        status: {
            type: String,
            enum: ["Approved", "Rejected"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("LeaveApprovals", LeaveApprovalSchema);
