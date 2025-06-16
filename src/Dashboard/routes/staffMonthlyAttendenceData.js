const express = require("express");
const StaffMonthlyAttendanceRoute = express.Router();
const {
  isValidObjectId,
} = require("../../utils/validation");
const StaffMonthlyAttendanceModel = require("../../models/StaffMonthlyAttendance");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const StaffDailyAttendanceModel = require("../../models/StaffDailyAttendance");

StaffMonthlyAttendanceRoute.get("/staff-monthly-attendance", userAuth, async (req, res) => {
    console.log("✅ Received query params:", req.query);
    // console.log("✅ Received body params:", req);
  try {

      const { month, year, staffType } = req.query;

    if (!month || !year || !staffType) {
      return res.status(400).json({ error: "month, year and staffType are required in query parameters." });
    }

    // Build date range for filtering by createdAt
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Fetch filtered daily attendance
    const dailyAttendance = await StaffDailyAttendanceModel.find({
      staffType,
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // Map to group attendance by unique staff (using email as key)
    const attendanceMap = {};

    dailyAttendance.forEach(record => {
      const key = record.email; // Assuming email is unique per staff

      if (!attendanceMap[key]) {
        attendanceMap[key] = {
          name: record.name,
          designation: record.designation,
          email: record.email,
          mobile: record.mobile,
          presents: 0,
          absents: 0,
          holidays: 0,
          leave: 0,
          attendance: []
        };
      }

      // Count attendance statuses
      switch (record.attendance) {
        case "Present":
          attendanceMap[key].presents += 1;
          break;
        case "Absent":
          attendanceMap[key].absents += 1;
          break;
        case "Holiday":
          attendanceMap[key].holidays += 1;
          break;
        case "On Leave":
          attendanceMap[key].leave += 1;
          break;
      }

      // Push daily attendance record
      attendanceMap[key].attendance.push({
        date: record.date || record.createdAt.toISOString().slice(0, 10), // fallback to createdAt if no date field
        status: record.attendance
      });
    });

    const result = Object.values(attendanceMap);

    res.status(200).json({
      message: "Monthly attendance data fetched successfully",
      data: result
    });

  } catch (error) {
    console.error("❌ Error fetching monthly attendance:", error.message);
    res.status(500).json({ error: "Internal server error while fetching monthly attendance." });
  }
});

module.exports = StaffMonthlyAttendanceRoute;