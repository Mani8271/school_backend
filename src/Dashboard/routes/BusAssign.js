const express = require("express");
const BusAssignRoute = express.Router();
const {
  isValidObjectId,
  validateEditBusAssignData,
} = require("../../utils/validation");
const BusAssignModel = require("../../models/BusAssign");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const moment = require("moment");
const NotificationsModel = require("../../models/Notifications");

BusAssignRoute.post("/assign-bus", userAuth, async (req, res) => {
  try {
    const BusAssign = new BusAssignModel(req.body);
    await BusAssign.save();
    const now = moment();
    const newNotification = new NotificationsModel({
      title: "Bus Assigned to",
      description: `Blog ${
        req.body.studentName || req.body.studentClass || req.body.route || ""
      } has been added successfully.`,
      date: now.format("YYYY-MM-DD"),
      time: now.format("h:mm A"),
    });
    await newNotification.save();
    res.send("Assigned bus  Successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "error assiging bus";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

BusAssignRoute.patch("/update-assign-bus", userAuth, async (req, res) => {
  try {
    const busassignId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(busassignId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    // Find the bus by ID first
    let busassign = await BusAssignModel.findById(busassignId);
    if (!busassign) {
      return res.status(404).json({ error: " assigned bus not found" });
    }
    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
      busassign[key] = req.body[key];
    });
    // Save updated bus
    await busassign.save();
    const now = new Date();
    const newNotification = new NotificationsModel({
      title: "Bus Assign Updated",
      description: `Bus Assign ${
        busassign.studentName ||
        busassign.studentClass ||
        busassign.route ||
        blogId
      } has been updated.`,
      date: now.format("YYYY-MM-DD"),
      time: now.format("h:mm A"),
    });

    await newNotification.save();
    return res.json({
      message: "assigned bus  updated successfully",
      busassign,
    });
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "error updating bus assign";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

BusAssignRoute.delete("/delete-assigned-bus", userAuth, async (req, res) => {
  try {
    const busassignId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(busassignId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await BusAssignModel.findByIdAndDelete(busassignId);
    const now = moment();
    const notification = new NotificationsModel({
      title: "Assigned Bus Deleted",
      description: `Assigned bus with ID ${busassignId} has been deleted from the system.`,
      date: now.format("YYYY-MM-DD"),
      time: now.format("h:mm A"),
    });

    // Save notification
    await notification.save();
    res.send("assigned bus deleted successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "error deleting assigned bus";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

BusAssignRoute.get("/search-assigned-bus", userAuth, async (req, res) => {
  try {
    const busAssign = await BusAssignModel.findOne(req.body);
    res.send(busAssign);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "bus data not found";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

BusAssignRoute.get("/assigned-bus-data", userAuth, async (req, res) => {
  try {
    const busAssign = await BusAssignModel.findOne(req.body);
    res.send(busAssign);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "bus data not found";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

BusAssignRoute.get("/assigned-buses-data", userAuth, async (req, res) => {
  try {
    const busAssign = await BusAssignModel.find();
    res.send(busAssign);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });

    let msg = "buses data not found";

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    } else if (error.message) {
      msg = error.message;
    }

    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

module.exports = BusAssignRoute;
