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
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding teacher time table";
    
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

TeachersTimetableRoute.patch("/update-teacher-timetable", userAuth, async (req, res) => {
  try {
    const timetableId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(timetableId)) {
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

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in update teacher time table";
  
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

TeachersTimetableRoute.delete("/delete-teacher-timetable", userAuth, async (req, res) => {
  try {
    const timetableId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(timetableId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await TimeTableModel.findByIdAndDelete(timetableId);
    res.send("teacher timetable deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting teacher time table";
  
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

TeachersTimetableRoute.get("/search-teacher-timetable", userAuth, async (req, res) => {
  try {
    const GetTimetable = await TimeTableModel.findOne(req.body);
    res.send(GetTimetable);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "teacher time table data not found";
  
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

TeachersTimetableRoute.get("/teacher-timetable-data", userAuth, async (req, res) => {
  try {
    const GetTimetable = await TimeTableModel.findOne(req.body);
    res.send(GetTimetable);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "teacher time table data not found";
  
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

TeachersTimetableRoute.get("/teachers-timetable-data", userAuth, async (req, res) => {
  try {
    const GetTimetable = await TimeTableModel.find();
    res.send(GetTimetable);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "teacher time table data not found";
  
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

module.exports = TeachersTimetableRoute;
