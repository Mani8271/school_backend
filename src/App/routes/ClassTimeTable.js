const express = require("express");
const ClassTimeTableRoute = express.Router();
const {isValidObjectId} = require("../../utils/validation");
const ClassTimeTableModel = require("../../models/Classes");
const { Error } = require("console");



ClassTimeTableRoute.post("/add-class-timetable",async (req, res) => {
    try {
      const AddClassTimeTable = new ClassTimeTableModel(req.body);
      await AddClassTimeTable.save();
      res.send("Added class time table Successfully");
    } catch (error) {
      res.status(400).send("Error adding the class time table");
    }
  }
);

ClassTimeTableRoute.patch("/update-class-timetable",  async (req, res) => {
  try {
    
    const timetableId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(timetableId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the bus by ID first
    let TimeTable = await ClassTimeTableModel.findById(timetableId);
    if (!TimeTable) {
      return res.status(404).json({ error: " class not found" });
    }

    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
        TimeTable[key] = req.body[key];
    });

    // Save updated bus
    await TimeTable.save();

    return res.json({
      message: "time table updated successfully",
      TimeTable,
    });

  } catch (error) {
    console.error("Error updating time table:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

ClassTimeTableRoute.delete("/delete-class-timetable",  async (req, res) => {
  try {
    const timetableId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    console.log(timetableId)
    if (!isValidObjectId(timetableId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await ClassTimeTableModel.findByIdAndDelete(timetableId);
    res.send("class time table deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the class time table");
  }
});

ClassTimeTableRoute.get("/search-class-timetable",  async (req, res) => {
  try {
    const GetTimeTable = await ClassTimeTableModel.findOne(req.body);
    res.send(GetTimeTable);
  } catch (error) {
    res.status(400).send("class time table not found");
  }
});

ClassTimeTableRoute.get("/class-timetable-data",  async (req, res) => {
  try {
    const GetTimeTable = await ClassTimeTableModel.findOne(req.body);
    res.send(GetTimeTable);
  } catch (error) {
    res.status(400).send("class time table data not found");
  }
});

ClassTimeTableRoute.get("/classes-timetable-data",  async (req, res) => {
  try {
    const GetTimeTable = await ClassTimeTableModel.find();
    res.send(GetTimeTable);
  } catch (error) {
    res.status(400).send("classes time table data not found");
  }
});

module.exports = ClassTimeTableRoute;
