const express = require("express");
const StaffMonthlyAttendanceRoute = express.Router();
const {
  isValidObjectId,
} = require("../../utils/validation");
const StaffAttendanceModel = require("../../models/StaffMonthlyAttendance");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

StaffMonthlyAttendanceRoute.post( "/add-staff-monthly-attendance", userAuth,async (req, res) => {
    try {
      const AddAttendance = new StaffAttendanceModel(req.body);
      await AddAttendance.save();
      res.send("Added Attendance Successfully");
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in add staff monthly attendance";
    
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

StaffMonthlyAttendanceRoute.patch("/update-Attendance", userAuth, async (req, res) => {
  try {
    const AttendanceId = req.body._id;

    if (!mongoose.Types.ObjectId.isValid(AttendanceId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const Attendance = await StaffAttendanceModel.findById(AttendanceId);
    if (!Attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    // ✅ Update fields from req.body
    Object.assign(Attendance, req.body);

    await Attendance.save();

    return res.json({
      message: "Attendance data updated successfully",
      Attendance,
    });
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "error in update staff monthly attendance";

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


StaffMonthlyAttendanceRoute.delete("/delete-Attendance", userAuth, async (req, res) => {
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
  
    let msg = "error in delete staff monthly attendance";
  
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

StaffMonthlyAttendanceRoute.get("/search-Attendance", userAuth, async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.findOne(req.body);
    res.send(GetAttendancedata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = " staff monthly attendance data not found";
  
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

StaffMonthlyAttendanceRoute.get("/Attendance-data", userAuth, async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.findOne(req.body);
    res.send(GetAttendancedata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "staff monthly attendance data not found";
  
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

StaffMonthlyAttendanceRoute.get("/all-Attendance-data", userAuth, async (req, res) => {
  try {
    const GetAttendancedata = await StaffAttendanceModel.find();
    res.send(GetAttendancedata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "staff monthly attendance data not found";
  
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

module.exports = StaffMonthlyAttendanceRoute;
