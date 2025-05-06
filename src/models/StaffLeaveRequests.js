
const mongoose = require("mongoose");
const getCurrentDateDetails = () => {
    const now = new Date();
    return {
        day: now.toLocaleDateString('en-US', { weekday: 'long' }), // e.g., "Monday"
        date: now.getDate(),  // e.g., 17
        month: now.toLocaleDateString('en-US', { month: 'long' }), // e.g., "March"
        year: now.getFullYear(), // e.g., 2025
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) // e.g., "10:30:45 AM"
    };
};
const StaffLeavesSchema = new mongoose.Schema(
    {
        teachernameid: {
            type: String,

        },

        teachername: {
            type: String,

        },
        subject: {
            type: String,

        },
        type: {
            type: String,

        },
        role: {
            type: String,
            default: "teacher"
        },
        startDate: {
            type: Date,

        },
        endDate: {
            type: Date,

        },
        Days:
        {
            type: Number,

        },
        status:
        {
            type: String,
            default: "Pending",
            enum: ["Approved", "Pending", "Rejected"]
        },
        purpose:
        {
            type: String,

        },
        day: {
            type: String,
            default: () => getCurrentDateDetails().day,
        },
        date: {
            type: Number,
            default: () => getCurrentDateDetails().date,
        },
        month: {
            type: String,
            default: () => getCurrentDateDetails().month,
        },
        year: {
            type: Number,
            default: () => getCurrentDateDetails().year,
        },
        time: {
            type: String,
            default: () => getCurrentDateDetails().time,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("StaffLeavesSchema", StaffLeavesSchema);