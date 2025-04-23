const express = require("express");
const LeaveRequestRoute = express.Router();
const {isValidObjectId,} = require("../../utils/validation");
const LeaveRequestsModel = require("../../models/StudentLeaveRequests");
const { Error } = require("console");
const multer = require("multer");
const path = require("path")
const fs = require("fs")


LeaveRequestRoute.post("/add-leave-request",async (req, res) => {
    try {
      const Addleaverequest = new LeaveRequestsModel(req.body);
      await Addleaverequest.save();
      res.send("Added leaverequest Successfully");
    } catch (error) {
      res.status(400).send("Error adding the leaverequest");
    }
  }
);

LeaveRequestRoute.patch("/update-leave-request-data",  async (req, res) => {
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
  } catch (error) {
    console.error("Error updating leave request:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

LeaveRequestRoute.delete("/delete-leave-request-data",  async (req, res) => {
  try {
    const leaverequestId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(leaverequestId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await LeaveRequestsModel.findByIdAndDelete(leaverequestId);
    res.send("leaverequest data deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the leave request data");
  }
});

LeaveRequestRoute.get("/search-leave-request-data",  async (req, res) => {
  try {
    const Getleaverequestdata = await LeaveRequestsModel.findOne(req.body);
    res.send(Getleaverequestdata);
  } catch (error) {
    res.status(400).send("leave request data not found");
  }
});

LeaveRequestRoute.get("/leave-request",  async (req, res) => {
  try {
    const Getleaverequestdata = await LeaveRequestsModel.findOne(req.body);
    res.send(Getleaverequestdata);
  } catch (error) {
    res.status(400).send("leave request data not found");
  }
});

LeaveRequestRoute.get("/leave-requests",  async (req, res) => {
  try {
    const Getleaverequestdata = await LeaveRequestsModel.find();
    res.send(Getleaverequestdata);
  } catch (error) {
    res.status(400).send("leave request data not found");
  }
});

module.exports = LeaveRequestRoute;
