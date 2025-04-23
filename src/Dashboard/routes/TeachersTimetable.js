const express = require("express");
const TeachersTimetableRoute = express.Router();
const {isValidObjectId, validateEditTeachersTimetableData} = require("../../utils/validation");
const TimeTableModel = require("../../models/TeachersTimetable");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");


TeachersTimetableRoute.post("/add-teacher-timetable",userAuth,async (req, res) => {
    try {
      const AddTimeTable = new TimeTableModel(req.body);
      await AddTimeTable.save();
      res.send("Added teacher timetable Successfully");
    } catch (error) {
      res.status(400).send("Error adding the teacher time table");
    }
  }
);

TeachersTimetableRoute.patch("/update-teacher-timetable", userAuth, async (req, res) => {
  try {
    const timetableId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(teacherId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    // Find the bus by ID first
    let timetable = await TimeTableModel.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ error: " class not found" });
    }
    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
        timetable[key] = req.body[key];
    });
    // Save updated bus
    await timetable.save();
    return res.json({
      message: "teacher timetable updated successfully",
      timetable,
    });

  } catch (error) {
    console.error("Error updating teacher timetable:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

TeachersTimetableRoute.delete("/delete-teacher-timetable", userAuth, async (req, res) => {
  try {
    const timetableId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(timetableId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await TimeTableModel.findByIdAndDelete(teacherId);
    res.send("teacher timetable deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the teacher");
  }
});

TeachersTimetableRoute.get("/search-teacher-timetable", userAuth, async (req, res) => {
  try {
    const GetTimetable = await TimeTableModel.findOne(req.body);
    res.send(GetTimetable);
  } catch (error) {
    res.status(400).send("teacher timetable not found");
  }
});

TeachersTimetableRoute.get("/teacher-timetable-data", userAuth, async (req, res) => {
  try {
    const GetTimetable = await TimeTableModel.findOne(req.body);
    res.send(GetTimetable);
  } catch (error) {
    res.status(400).send("timetable data not found");
  }
});

TeachersTimetableRoute.get("/teachers-timetable-data", userAuth, async (req, res) => {
  try {
    const GetTimetable = await TimeTableModel.find();
    res.send(GetTimetable);
  } catch (error) {
    res.status(400).send("timetable  data not found");
  }
});

module.exports = TeachersTimetableRoute;
