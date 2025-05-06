const express = require("express");
const FeesRoute = express.Router();
const {isValidObjectId,} = require("../../utils/validation");
const FeesModel = require("../../models/Fees");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");


FeesRoute.post("/add-fee",userAuth,async (req, res) => {
    try {
      const AddFees = new FeesModel(req.body);
      await AddFees.save();
      res.send("Added fees Successfully");
    } catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding fee";
    
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

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in updating fee";
  
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

FeesRoute.delete("/delete-fee", userAuth, async (req, res) => {
  try {
    const feesId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(feesId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await FeesModel.findByIdAndDelete(feesId);
    res.send("fee deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting fee";
  
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

FeesRoute.get("/search-fee", userAuth, async (req, res) => {
  try {
    const GetFees = await FeesModel.findOne(req.body);
    res.send(GetFees);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "fees data not found";
  
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

FeesRoute.get("/fee-data", userAuth, async (req, res) => {
  try {
    const GetFees = await FeesModel.findOne(req.body);
    res.send(GetFees);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "fees data not found";
  
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

FeesRoute.get("/fees-data", userAuth, async (req, res) => {
  try {
    const GetFees = await FeesModel.find();
    res.send(GetFees);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "fees data not found";
  
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

module.exports = FeesRoute;
