const express = require("express");
const BusListRoute = express.Router();
const {isValidObjectId,validateEditBusListData} = require("../../utils/validation");
const BusListModel = require("../../models/BusList");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

BusListRoute.post("/add-bus",userAuth,async (req, res) => {
    try {
      const AddBus = new BusListModel(req.body);
      await AddBus.save();
      res.send("Added Bus Successfully");
    } catch (error) {
      res.status(400).send("Error adding the bus");
    }
  }
);

BusListRoute.patch("/update-bus-data", userAuth, async (req, res) => {
  try {
    
    const busId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(busId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the bus by ID first
    let bus = await BusListModel.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
      bus[key] = req.body[key];
    });

    // Save updated bus
    await bus.save();

    return res.json({
      message: "Bus data updated successfully",
      bus,
    });

  } catch (error) {
    console.error("Error updating bus:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

BusListRoute.delete("/delete-bus-data", userAuth, async (req, res) => {
  try {
    const busId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(busId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await BusListModel.findByIdAndDelete(busId);
    res.send("bus data deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the bus data");
  }
});

BusListRoute.get("/search-bus-data", userAuth, async (req, res) => {
  try {
    const GetBusdata = await BusListModel.findOne(req.body);
    res.send(GetBusdata);
  } catch (error) {
    res.status(400).send("bus data not found");
  }
});

BusListRoute.get("/bus-data", userAuth, async (req, res) => {
  try {
    const GetBusdata = await BusListModel.findOne(req.body);
    res.send(GetBusdata);
  } catch (error) {
    res.status(400).send("bus data not found");
  }
});

BusListRoute.get("/buses-data", userAuth, async (req, res) => {
  try {
    const GetBusdata = await BusListModel.find();
    res.send(GetBusdata);
  } catch (error) {
    res.status(400).send("bus data not found");
  }
});

module.exports = BusListRoute;
