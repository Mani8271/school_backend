const express = require("express");
const AttendanceRoute = express.Router();
const {isValidObjectId,} = require("../../utils/validation");
const AttendanceModel = require("../../models/StudentsAttendance");
const { Error } = require("console");
const { AppuserAuth } = require("../../middlewares/auth");
const multer = require("multer");
const path = require("path")
const fs = require("fs")


AttendanceRoute.post("/add-attendance",async (req, res) => {
    try {
      const Addattendance = new AttendanceModel(req.body);
      await Addattendance.save();
      res.send("Added attendance Successfully");
    } catch (error) {
      res.status(400).send("Error adding the attendance");
    }
  }
);

AttendanceRoute.patch("/update-attendance-data",  async (req, res) => {
  try {
    const attendanceId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(attendanceId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    // Find the attendance by ID first
    let attendance = await AttendanceModel.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ error: "attendance not found" });
    }
    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
       attendance[key] = req.body[key];
    });
    // Save updated attendance
    await attendance.save();
    return res.json({
      message: "attendance data updated successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error updating attendance request:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

AttendanceRoute.delete("/delete-attendance-data",  async (req, res) => {
  try {
    const attendanceId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(attendanceId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await AttendanceModel.findByIdAndDelete(attendanceId);
    res.send("attendance data deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the attendance request data");
  }
});

AttendanceRoute.get("/search-attendance-data",  async (req, res) => {
  try {
    const Getattendancedata = await AttendanceModel.findOne(req.body);
    res.send(Getattendancedata);
  } catch (error) {
    res.status(400).send("attendance request data not found");
  }
});

AttendanceRoute.get("/attendance",  async (req, res) => {
  try {
    const Getattendancedata = await AttendanceModel.findOne(req.body);
    res.send(Getattendancedata);
  } catch (error) {
    res.status(400).send("attendance request data not found");
  }
});

AttendanceRoute.get("/attendances",  async (req, res) => {
  try {
    const Getattendancedata = await AttendanceModel.find();
    res.send(Getattendancedata);
  } catch (error) {
    res.status(400).send("attendance request data not found");
  }
});

module.exports = AttendanceRoute;
