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
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding bus";
    
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

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in updating bus data";
  
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
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting bus data";
  
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

BusListRoute.get("/search-bus-data", userAuth, async (req, res) => {
  try {
    const GetBusdata = await BusListModel.findOne(req.body);
    res.send(GetBusdata);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "bus data not found";
  
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

BusListRoute.get("/bus-data", userAuth, async (req, res) => {
  try {
    const GetBusdata = await BusListModel.findOne(req.body);
    res.send(GetBusdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "bus data not found";
  
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

BusListRoute.get("/buses-data", userAuth, async (req, res) => {
  try {
    const GetBusdata = await BusListModel.find();
    res.send(GetBusdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "buses data not found";
  
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

module.exports = BusListRoute;
