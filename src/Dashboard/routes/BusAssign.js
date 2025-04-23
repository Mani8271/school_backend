const express = require("express");
const BusAssignRoute = express.Router();
const {isValidObjectId,validateEditBusAssignData} = require("../../utils/validation");
const BusAssignModel = require("../../models/BusAssign");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");


BusAssignRoute.post("/assign-bus",userAuth,async (req, res) => {
    try {
      const BusAssign = new BusAssignModel(req.body);
      await BusAssign.save();
      res.send("Assigned bus  Successfully");
    } catch (error) {
      res.status(400).send("Error assigning the bus");
    }
  }
);

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
    return res.json({
      message: "assigned bus  updated successfully",
      busassign,
    });
  } catch (error) {
    console.error("Error updating assigned bus:", error);
    return res.status(500).json({ error: "Something went wrong" });
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
    res.send("assigned bus deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the assigned bus ");
  }
});

BusAssignRoute.get("/search-assigned-bus", userAuth, async (req, res) => {
  try {
    const busAssign = await BusAssignModel.findOne(req.body);
    res.send(busAssign);
  } catch (error) {
    res.status(400).send("bus not found");
  }
});

BusAssignRoute.get("/assigned-bus-data", userAuth, async (req, res) => {
  try {
    const busAssign = await StudentsModel.findOne(req.body);
    res.send(busAssign);
  } catch (error) {
    res.status(400).send("bus data not found");
  }
});

BusAssignRoute.get("/assigned-buses-data", userAuth, async (req, res) => {
  try {
    const busAssign = await BusAssignModel.find();
    res.send(busAssign);
  } catch (error) {
    res.status(400).send("bus data not found");
  }
});

module.exports = BusAssignRoute;
