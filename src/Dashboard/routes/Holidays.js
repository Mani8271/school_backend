const express = require("express");
const HolidaysRoute = express.Router();
const {validateEditHolidayData,isValidObjectId} = require("../../utils/validation");
const HolidaysModel = require("../../models/Holidays");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

HolidaysRoute.post("/add-holiday", userAuth, async (req, res) => {
  try {
    const Addholiday = new HolidaysModel(req.body);
    await Addholiday.save();
    res.send("Added holiday Successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in adding holiday";
  
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

HolidaysRoute.patch("/update-holiday-data", userAuth, async (req, res) => {
  try {
  
    const holidayId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(holidayId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    // Find and update holiday by `_id`
    const updatedholiday = await HolidaysModel.findByIdAndUpdate(
      holidayId, // Find by ID
      { $set: req.body }, // Update fields
      { new: true } // Return updated document
    );
    if (!updatedholiday) {
      return res.status(404).json({ error: "holiday not found" });
    }
    return res.json({
      message: "holiday data updated successfully",
      holiday: updatedholiday,
    });
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in updating holiday data";
  
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

HolidaysRoute.delete("/delete-holiday-data", userAuth, async (req, res) => {
  try {
    const holidayId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(holidayId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await HolidaysModel.findByIdAndDelete(holidayId);
    res.send("holiday data deleted successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting holiday data";
  
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

HolidaysRoute.get("/search-holiday-data", userAuth, async (req, res) => {
  try {
    const Getholidaydata = await HolidaysModel.findOne(req.body);
    res.send(Getholidaydata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "holiday data not found";
  
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

HolidaysRoute.get("/holiday-data", userAuth, async (req, res) => {
  try {
    const Getholidaydata = await HolidaysModel.findOne(req.body);
    res.send(Getholidaydata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "holiday data not found";
  
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

HolidaysRoute.get("/holidays-data", userAuth, async (req, res) => {
  try {
    const Getholidaydata = await HolidaysModel.find();
    res.send(Getholidaydata);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "holidays data not found";
  
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

module.exports = HolidaysRoute;
