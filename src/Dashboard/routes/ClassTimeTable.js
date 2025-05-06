const express = require("express");
const ClassTimeTableRoute = express.Router();
const {isValidObjectId} = require("../../utils/validation");
const ClassTimeTableModel = require("../../models/ClassTimeTable");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");


ClassTimeTableRoute.post("/add-class-timetable",userAuth,async (req, res) => {
  console.log(req.body);
    try {
      const AddClassTimeTable = new ClassTimeTableModel(req.body);

      await AddClassTimeTable.save();
      res.send("Added class time table Successfully");
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding class time table";
    
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

ClassTimeTableRoute.patch("/update-class-timetable", userAuth, async (req, res) => {
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

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in updating class time table";
  
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

ClassTimeTableRoute.delete("/delete-class-timetable", userAuth, async (req, res) => {
  try {
    const timetableId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(timetableId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await ClassTimeTableModel.findByIdAndDelete(timetableId);
    res.send("class time table deleted successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting class time table";
  
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

ClassTimeTableRoute.get("/search-class-timetable", userAuth, async (req, res) => {
  try {
    const GetTimeTable = await ClassTimeTableModel.findOne(req.body);
    res.send(GetTimeTable);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "class timetable data not found";
  
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

ClassTimeTableRoute.get("/class-timetable-data", userAuth, async (req, res) => {
  try {
    const GetTimeTable = await ClassTimeTableModel.findOne(req.body);
    res.send(GetTimeTable);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "class timetable data not found";
  
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

ClassTimeTableRoute.get("/classes-timetable-data", userAuth, async (req, res) => {
  try {
    const GetTimeTable = await ClassTimeTableModel.find();
    res.send(GetTimeTable);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "classes timetable data not found";
  
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

module.exports = ClassTimeTableRoute;
