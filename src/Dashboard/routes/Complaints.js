const express = require("express");
const ComplaintsRoute = express.Router();
const {isValidObjectId} = require("../../utils/validation");
const ComplaintListModel = require("../../models/Complaints");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

ComplaintsRoute.post("/add-complaint",userAuth,async (req, res) => {
    try {
      const Addcomplaint = new ComplaintListModel(req.body);
      await Addcomplaint.save();
      res.send("Added complaint Successfully");
    }   catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "buses route not found";
    
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

ComplaintsRoute.patch("/update-complaint-data", userAuth, async (req, res) => {
  try {

    const complaintId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(complaintId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    // Find the complaint by ID first
    let complaint = await ComplaintListModel.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ error: "complaint not found" });
    }
    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
      complaint[key] = req.body[key];
    });
    // Save updated complaint
    await complaint.save();
    return res.json({
      message: "complaint data updated successfully",
      complaint,
    });
  }   catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "buses route not found";
  
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

ComplaintsRoute.delete("/delete-complaint-data", userAuth, async (req, res) => {
  try {
    const complaintId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(complaintId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await ComplaintListModel.findByIdAndDelete(complaintId);
    res.send("complaint data deleted successfully");
  }   catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "buses route not found";
  
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

ComplaintsRoute.get("/search-complaint-data", userAuth, async (req, res) => {
  try {
    const Getcomplaintdata = await ComplaintListModel.findOne(req.body);
    res.send(Getcomplaintdata);
  }   catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "buses route not found";
  
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

ComplaintsRoute.get("/complaint-data", userAuth, async (req, res) => {
  try {
    const Getcomplaintdata = await ComplaintListModel.findOne(req.body);
    res.send(Getcomplaintdata);
  }   catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "buses route not found";
  
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

ComplaintsRoute.get("/complaints-data", userAuth, async (req, res) => {
  try {
    const Getcomplaintdata = await ComplaintListModel.find();
    res.send(Getcomplaintdata);
  }   catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "buses route not found";
  
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

module.exports = ComplaintsRoute;
