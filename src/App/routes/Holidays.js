const express = require("express");
const HolidaysRoute = express.Router();
const {validateEditHolidayData,isValidObjectId} = require("../../utils/validation");
const HolidaysModel = require("../../models/Holidays");
const { Error } = require("console");
const { AppuserAuth } = require("../../middlewares/auth");

HolidaysRoute.post("/add-holiday",  async (req, res) => {
  try {
    const Addholiday = new HolidaysModel(req.body);
    await Addholiday.save();
    res.send("Added holiday Successfully");
  } catch (error) {
    res.status(400).send("Error adding the holiday");
  }
});

HolidaysRoute.patch("/update-holiday-data",  async (req, res) => {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

HolidaysRoute.delete("/delete-holiday-data",  async (req, res) => {
  try {
    const holidayId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(holidayId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await HolidaysModel.findByIdAndDelete(holidayId);
    res.send("holiday data deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the holiday data");
  }
});

HolidaysRoute.get("/search-holiday-data",  async (req, res) => {
  try {
    const Getholidaydata = await HolidaysModel.findOne(req.body);
    res.send(Getholidaydata);
  } catch (error) {
    res.status(400).send("holiday data not found");
  }
});

HolidaysRoute.get("/holiday-data",  async (req, res) => {
  try {
    const Getholidaydata = await HolidaysModel.findOne(req.body);
    res.send(Getholidaydata);
  } catch (error) {
    res.status(400).send("holiday data not found");
  }
});

HolidaysRoute.get("/holidays-data",  async (req, res) => {
  try {
    const Getholidaydata = await HolidaysModel.find();
    res.send(Getholidaydata);
  } catch (error) {
    res.status(400).send("holiday data not found");
  }
});

module.exports = HolidaysRoute;
