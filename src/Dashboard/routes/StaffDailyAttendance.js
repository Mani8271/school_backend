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
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding staff attendance";
    
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

StaffDailyAttendanceRoute.patch("/update-Attendance", userAuth, async (req, res) => {
  try {
    const AttendanceId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(AttendanceId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find and update the Attendance
    const updatedAttendance = await StaffAttendanceModel.findByIdAndUpdate(
      AttendanceId,
      req.body, // Use the data from the request to update the document
      { new: true } // Return the updated document
    );

    if (!updatedAttendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    return res.json({
      message: "Attendance data updated successfully",
      Attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "error in updating attendance";

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


StaffDailyAttendanceRoute.delete("/delete-Attendance", userAuth, async (req, res) => {
  try {
    const AttendanceId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(AttendanceId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await StaffAttendanceModel.findByIdAndDelete(AttendanceId);
    res.send("Attendance data deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting attendance";
  
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

StaffDailyAttendanceRoute.get("/search-Attendance", userAuth, async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.findOne(req.body);
    res.send(GetAttendancedata);
  }  catch (error) {
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

StaffDailyAttendanceRoute.get("/Attendance-data", userAuth, async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.findOne(req.body);
    res.send(GetAttendancedata);
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

StaffDailyAttendanceRoute.get("/all-Attendance-data", userAuth, async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.find();
    res.send(GetAttendancedata);
  }  catch (error) {
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

module.exports = StaffDailyAttendanceRoute;
