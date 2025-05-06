const express = require("express");
const LeaveRequestRoute = express.Router();
const {isValidObjectId,} = require("../../utils/validation");
const LeaveRequestsModel = require("../../models/LeaveRequestApproval");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

LeaveRequestRoute.post("/add-leave-approval",userAuth,async (req, res) => {
    try {
      const Addleaverequest = new LeaveRequestsModel(req.body);
      await Addleaverequest.save();
      res.send("Added leaverequest Successfully");
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in leave approval";
    
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

LeaveRequestRoute.patch("/update-leave-approval-data", userAuth, async (req, res) => {
  try {
    const leaverequestId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(leaverequestId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    // Find the leaverequest by ID first
    let leaverequest = await LeaveRequestsModel.findById(leaverequestId);
    if (!leaverequest) {
      return res.status(404).json({ error: "leaverequest not found" });
    }
    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
       leaverequest[key] = req.body[key];
    });
    // Save updated leaverequest
    await leaverequest.save();
    return res.json({
      message: "leaverequest data updated successfully",
      leaverequest,
    });
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in updating leave approval";
  
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

LeaveRequestRoute.delete("/delete-leave-approval", userAuth, async (req, res) => {
  try {
    const leaverequestId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(leaverequestId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await LeaveRequestsModel.findByIdAndDelete(leaverequestId);
    res.send("leaverequest data deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting leave approval";
  
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

LeaveRequestRoute.get("/search-leave-approval", userAuth, async (req, res) => {
  try {
    const Getleaverequestdata = await LeaveRequestsModel.findOne(req.body);
    res.send(Getleaverequestdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "leave approval data not found";
  
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

LeaveRequestRoute.get("/leave-request", userAuth, async (req, res) => {
  try {
    const Getleaverequestdata = await LeaveRequestsModel.findOne(req.body);
    res.send(Getleaverequestdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "leave approval data not found";
  
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

LeaveRequestRoute.get("/leave-requests", userAuth, async (req, res) => {
  try {
    const Getleaverequestdata = await LeaveRequestsModel.find();
    res.send(Getleaverequestdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "leave approval data not found";
  
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

module.exports = LeaveRequestRoute;
