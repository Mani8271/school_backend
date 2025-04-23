const express = require("express");
const FeesRoute = express.Router();
const {isValidObjectId, validateEditFeesData} = require("../../utils/validation");
const FeesModel = require("../../models/Fees");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");


FeesRoute.post("/add-fee",userAuth,async (req, res) => {
    try {
      const AddFees = new FeesModel(req.body);
      await AddFees.save();
      res.send("Added fees Successfully");
    } catch (error) {
      res.status(400).send("Error adding the fees");
    }
  }
);

FeesRoute.patch("/update-fee", userAuth, async (req, res) => {
  try {
    const feesId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(feesId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the bus by ID first
    let fees = await FeesModel.findById(feesId);
    if (!fees) {
      return res.status(404).json({ error: " fees not found" });
    }

    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
        fees[key] = req.body[key];
    });

    // Save updated bus
    await fees.save();

    return res.json({
      message: "fees updated successfully",
      fees,
    });

  } catch (error) {
    console.error("Error updating fees:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

FeesRoute.delete("/delete-fee", userAuth, async (req, res) => {
  try {
    const feesId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(feesId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await FeesModel.findByIdAndDelete(feesId);
    res.send("fee deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the fee");
  }
});

FeesRoute.get("/search-fee", userAuth, async (req, res) => {
  try {
    const GetFees = await FeesModel.findOne(req.body);
    res.send(GetFees);
  } catch (error) {
    res.status(400).send("fees not found");
  }
});

FeesRoute.get("/fee-data", userAuth, async (req, res) => {
  try {
    const GetFees = await FeesModel.findOne(req.body);
    res.send(GetFees);
  } catch (error) {
    res.status(400).send("fees data not found");
  }
});

FeesRoute.get("/fees-data", userAuth, async (req, res) => {
  try {
    const GetFees = await FeesModel.find();
    res.send(GetFees);
  } catch (error) {
    res.status(400).send("fees data not found");
  }
});

module.exports = FeesRoute;
