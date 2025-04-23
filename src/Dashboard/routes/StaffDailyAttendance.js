const express = require("express");
const StaffDailyAttendanceRoute = express.Router();
const {
  validateEditAttendancesData,
  isValidObjectId,
} = require("../../utils/validation");
const StaffAttendanceModel = require("../../models/StaffDailyAttendance");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

StaffDailyAttendanceRoute.post( "/add-staff-daily-attendance", userAuth,async (req, res) => {
    try {
      const AddAttendance = new StaffAttendanceModel(req.body);
      await AddAttendance.save();
      res.send("Added Attendance Successfully");
    } catch (error) {
      res.status(400).send("Error adding the Attendance");
    }
  }
);

StaffDailyAttendanceRoute.patch("/update-Attendance",userAuth,async (req, res) => {
    try {
      const AttendanceId = req.body._id;
      // Ensure `_id` is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(AttendanceId)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      // Find the Attendance first
      const Attendance = await StaffAttendanceModel.findById(AttendanceId);
      if (!Attendance) {
        return res.status(404).json({ error: "Attendance not found" });
      }
      // ✅ Save the updated Attendance
      await Attendance.save();
      return res.json({
        message: "Attendance data updated successfully",
        Attendance,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

StaffDailyAttendanceRoute.delete("/delete-Attendance", userAuth, async (req, res) => {
  try {
    const AttendanceId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(AttendanceId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await StaffAttendanceModel.findByIdAndDelete(AttendanceId);
    res.send("Attendance data deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the Attendance data");
  }
});

StaffDailyAttendanceRoute.get("/search-Attendance", userAuth, async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.findOne(req.body);
    res.send(GetAttendancedata);
  } catch (error) {
    res.status(400).send("Attendance data not found");
  }
});

StaffDailyAttendanceRoute.get("/Attendance-data", userAuth, async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.findOne(req.body);
    res.send(GetAttendancedata);
  } catch (error) {
    res.status(400).send("Attendance data not found");
  }
});

StaffDailyAttendanceRoute.get("/all-Attendance-data", userAuth, async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.find();
    res.send(GetAttendancedata);
  } catch (error) {
    res.status(400).send("Attendance data not found");
  }
});

module.exports = StaffDailyAttendanceRoute;
