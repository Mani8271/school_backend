const express = require("express");
const AttendanceRoute = express.Router();
const { isValidObjectId, } = require("../../utils/validation");
const AttendanceModel = require("../../models/StudentsAttendance");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const multer = require("multer");
const path = require("path")
const fs = require("fs")


AttendanceRoute.post("/add-student-attendance", userAuth, async (req, res) => {
  try {
    const Addattendance = new AttendanceModel(req.body);
    await Addattendance.save();
    res.send("Added attendance Successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "error in add student attendance";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map(err => err.message).join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
}
);

AttendanceRoute.patch("/update-student-attendance-data", userAuth, async (req, res) => {
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
    console.error("❌ Error:", { message: error.message });

    let msg = "error in update student attendance";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map(err => err.message).join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

AttendanceRoute.delete("/delete-student-attendance-data", userAuth, async (req, res) => {
  try {
    const attendanceId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(attendanceId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await AttendanceModel.findByIdAndDelete(attendanceId);
    res.send("attendance data deleted successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "error in delete student attendance";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map(err => err.message).join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

AttendanceRoute.get("/search-student-attendance-data", userAuth, async (req, res) => {
  try {
    const Getattendancedata = await AttendanceModel.findOne(req.body);
    res.send(Getattendancedata);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "attendance data not found";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map(err => err.message).join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

AttendanceRoute.get("/student-attendance", userAuth, async (req, res) => {
  try {
    const Getattendancedata = await AttendanceModel.findOne(req.body);
    res.send(Getattendancedata);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "attendance data not found";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map(err => err.message).join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

AttendanceRoute.get("/student-attendances", userAuth, async (req, res) => {
  try {
    const Getattendancedata = await AttendanceModel.find();
    res.send(Getattendancedata);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "attendance data not found";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map(err => err.message).join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

AttendanceRoute.get("/student-monthly-attendance", userAuth, async (req, res) => {
  try {
    const { month, year } = req.query;
    console.log("Received month:", month, "and year:", year);

    if (!month || !year) {
      return res.status(400).json({
        error: "month and year are required in the request body.",
      });
    }

    const attendanceData = await AttendanceModel.find({
      month,
      year: parseInt(year),
    }).sort({ date: 1 });

    const studentMap = {};

    attendanceData.forEach(record => {
      const key = record.student; // ✅ use student ID

      if (!studentMap[key]) {
        studentMap[key] = {
          studentId: record.student,
          studentName: record.studentName,
          presents: 0,
          absents: 0,
          leave: 0,
          holidays: 0,
          attendance: []
        };
      }

      // Count based on status
      switch (record.status) {
        case "Present":
          studentMap[key].presents += 1;
          break;
        case "Absent":
          studentMap[key].absents += 1;
          break;
        case "On Leave":
          studentMap[key].leave += 1;
          break;
        case "Holiday":
          studentMap[key].holidays += 1;
          break;
      }

      // Store attendance detail
      const attendanceDate = record.createdAt?.toISOString().split("T")[0];
      studentMap[key].attendance.push({
        date: attendanceDate,
        status: record.status
      });
    });

    const result = Object.values(studentMap);

    res.status(200).json({
      message: "Monthly attendance data fetched successfully",
      data: result
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = AttendanceRoute;
