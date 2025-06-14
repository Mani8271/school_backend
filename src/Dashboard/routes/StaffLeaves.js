const express = require("express");
const StaffLeavesRoute = express.Router();
const {
  validateEditStaffLeavesData,
  isValidObjectId,
} = require("../../utils/validation");
const StaffLeavesModel = require("../../models/StaffLeaveRequests");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const mongoose = require("mongoose");

StaffLeavesRoute.post( "/add-staff-leave", userAuth,async (req, res) => {
    try {
      const AddLeaves= new StaffLeavesModel(req.body);
      await AddLeaves.save();
      res.send("Added LeavesSuccessfully");
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in add staff leave";
    
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

StaffLeavesRoute.patch("/update-leaves", userAuth, async (req, res) => {
  try {
    const leavesId = req.body._id;

    if (!mongoose.Types.ObjectId.isValid(leavesId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the leave request
    const leaves = await StaffLeavesModel.findById(leavesId);
    if (!leaves) {
      return res.status(404).json({ error: "Leaves not found" });
    }

    // ✅ Update the leave fields from req.body
    Object.keys(req.body).forEach((key) => {
      if (key !== "_id") {
        leaves[key] = req.body[key];
      }
    });

    // ✅ Save the updated document
    await leaves.save();

    return res.json({
      message: "Leaves data updated successfully",
      leaves,
    });
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "Error in update staff leave";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map((err) => err.message).join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});


StaffLeavesRoute.delete("/delete-leaves", userAuth, async (req, res) => {
  try {
    const leavesId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    console.log("leavesId", leavesId);
    if (!isValidObjectId(leavesId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await StaffLeavesModel.findByIdAndDelete(leavesId);
    res.send("Leaves data deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in delete leave";
  
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

StaffLeavesRoute.get("/search-leaves", userAuth, async (req, res) => {
  try {
    const Getleavesdata = await StaffLeavesModel.findOne(req.body);
    res.send(Getleavesdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "leave data not found";
  
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

StaffLeavesRoute.get("/leave-data", userAuth, async (req, res) => {
  try {
    const Getleavesdata = await StaffLeavesModel.findOne(req.body);
    res.send(Getleavesdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "leave data not found";
  
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

StaffLeavesRoute.get("/all-leaves-data", userAuth, async (req, res) => {
  try {
    const Getleavesdata = await StaffLeavesModel.find();
    res.send(Getleavesdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "leaves data not found";
  
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

module.exports = StaffLeavesRoute;
