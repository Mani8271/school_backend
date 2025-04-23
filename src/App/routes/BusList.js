const express = require("express");
const BusListRoute = express.Router();
const { isValidObjectId, validateEditBusListData } = require("../../utils/validation");
const BusListModel = require("../../models/BusList");

// Add a new bus
BusListRoute.post("/add-bus", async (req, res) => {
  try {
    const addBus = new BusListModel(req.body);
    await addBus.save();
    res.status(201).json({ message: "Bus added successfully", bus: addBus });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error adding the bus" });
  }
});

// Update bus details
BusListRoute.patch("/update-bus-data", async (req, res) => {
  try {
    const busId = req.body._id;

    if (!isValidObjectId(busId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    let bus = await BusListModel.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    Object.assign(bus, req.body);
    await bus.save();

    res.json({ message: "Bus data updated successfully", bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Delete bus data
BusListRoute.delete("/delete-bus-data", async (req, res) => {
  try {
    const busId = req.body._id;

    if (!isValidObjectId(busId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const deletedBus = await BusListModel.findByIdAndDelete(busId);
    if (!deletedBus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    res.json({ message: "Bus data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting the bus data" });
  }
});

// Search for a bus (Use query parameters instead of body)
BusListRoute.get("/search-bus-data", async (req, res) => {
  try {
    const getBusData = await BusListModel.findOne(req.query);
    if (!getBusData) {
      return res.status(404).json({ error: "Bus data not found" });
    }
    res.json(getBusData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bus data" });
  }
});

// Get bus details (Use query instead of body)
BusListRoute.get("/bus-data", async (req, res) => {
  try {
    const getBusData = await BusListModel.findOne(req.query);
    if (!getBusData) {
      return res.status(404).json({ error: "Bus data not found" });
    }
    res.json(getBusData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bus data" });
  }
});

// Get all buses
BusListRoute.get("/buses-data", async (req, res) => {
  try {
    const getAllBuses = await BusListModel.find();
    res.json(getAllBuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bus data" });
  }
});

module.exports = BusListRoute;
