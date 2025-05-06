
const mongoose = require("mongoose");

// Function to get formatted date details
const getCurrentDateDetails = () => {
    const now = new Date();
    return {
        day: now.toLocaleDateString('en-US', { weekday: 'long' }), // e.g., "Monday"
        date: now.getDate(),  // e.g., 17
        month: now.toLocaleDateString('en-US', { month: 'long' }), // e.g., "March"
        year: now.getFullYear() // e.g., 2025
    };
};
const StudentsAttendanceSchema = new mongoose.Schema(
    {
        teachername: {
            type: String,

        },
        studentName: {
            type: String,

        },
        class:
        {
            type: String,
        },
        section:
        {
            type: String,

        },
        rollNumber:
        {
            type: String,

        },
        present:
        {
            type: String,

        },
        absent:
        {
            type: String,

        },
        onLeave:
        {
            type: String,

        }
        ,
        student:
        {
            type: String,

        },
          student:
        {
            type: String,

        },
        status:
        {
            type: String,

        },
        holiday:
        {
            type: String,

        },
        // Auto-generate Date Details
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
    },
    { timestamps: true }
)
StudentsAttendanceSchema.index({ studentName: 1, date: 1, month: 1, year: 1 }, { unique: true });
module.exports = mongoose.model("StudentsAttendance", StudentsAttendanceSchema);