const express = require("express");
const StaffMonthlyAttendanceRoute = express.Router();
const {
  isValidObjectId,
} = require("../../utils/validation");
const StaffAttendanceModel = require("../../models/StaffMonthlyAttendance");
const { Error } = require("console");
const { AppuserAuth } = require("../../middlewares/auth");

StaffMonthlyAttendanceRoute.post( "/add-staff-monthly-attendance", async (req, res) => {
    try {
      const AddAttendance = new StaffAttendanceModel(req.body);
      await AddAttendance.save();
      res.send("Added Attendance Successfully");
    } catch (error) {
      res.status(400).send("Error adding the Attendance");
    }
  }
);

StaffMonthlyAttendanceRoute.patch("/update-Attendance",async (req, res) => {
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

StaffMonthlyAttendanceRoute.delete("/delete-Attendance",  async (req, res) => {
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

StaffMonthlyAttendanceRoute.get("/search-Attendance",  async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.findOne(req.body);
    res.send(GetAttendancedata);
  } catch (error) {
    res.status(400).send("Attendance data not found");
  }
});

StaffMonthlyAttendanceRoute.get("/Attendance-data",  async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.findOne(req.body);
    res.send(GetAttendancedata);
  } catch (error) {
    res.status(400).send("Attendance data not found");
  }
});

StaffMonthlyAttendanceRoute.get("/all-Attendance-data",  async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.find();
    res.send(GetAttendancedata);
  } catch (error) {
    res.status(400).send("Attendance data not found");
  }
});

module.exports = StaffMonthlyAttendanceRoute;
