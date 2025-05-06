const express = require("express");
const BusRoute = express.Router();
const {isValidObjectId,validateEditBusRouteData} = require("../../utils/validation");
const BusRouteModel = require("../../models/BusRoutes");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

BusRoute.post("/add-bus-route",userAuth,async (req, res) => {
    try {
      const AddBusRoute = new BusRouteModel(req.body);
      await AddBusRoute.save();
      res.send("Added Bus Route Successfully");
    } catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding bus route";
    
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

BusRoute.patch("/update-bus-route", userAuth, async (req, res) => {
  try {
    const busrouteId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(busrouteId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    // Find the bus by ID first
    let busroute = await BusRouteModel.findById(busrouteId);
    if (!busroute) {
      return res.status(404).json({ error: "Bus route not found" });
    }
    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
      busroute[key] = req.body[key];
    });
    // Save updated bus
    await busroute.save();
    return res.json({
      message: "Bus data updated successfully",
      busroute,
    });
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in updating bus route";
  
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

BusRoute.delete("/delete-bus-route", userAuth, async (req, res) => {
  try {
    const busrouteId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(busrouteId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await BusRouteModel.findByIdAndDelete(busrouteId);
    res.send("bus route deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting bus route";
  
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

BusRoute.get("/search-bus-route", userAuth, async (req, res) => {
  try {
    const GetBusRoutedata = await BusRouteModel.findOne(req.body);
    res.send(GetBusRoutedata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "bus route not found";
  
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

BusRoute.get("/bus-route-data", userAuth, async (req, res) => {
  try {
    const GetBusRoutedata = await BusRouteModel.findOne(req.body);
    res.send(GetBusRoutedata);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "bus route not found";
  
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

BusRoute.get("/buses-routes-data", userAuth, async (req, res) => {
  try {
    const GetBusRoutedata = await BusRouteModel.find();
    res.send(GetBusRoutedata);
  }  catch (error) {
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

module.exports = BusRoute;
