const express = require("express");
const SectionRoute = express.Router();
const {isValidObjectId} = require("../../utils/validation");
const SectionModel = require("../../models/SectionList");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");


SectionRoute.post("/add-section",userAuth,async (req, res) => {
    try {
      const AddSection = new SectionModel(req.body);
      await AddSection.save();
      res.send("Added section Successfully");
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding section";
    
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

SectionRoute.patch("/update-section", userAuth, async (req, res) => {
  try {
    
    const sectionId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(sectionId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the bus by ID first
    let Section = await SectionModel.findById(sectionId);
    if (!Section) {
      return res.status(404).json({ error: " class not found" });
    }

    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
        Section[key] = req.body[key];
    });

    // Save updated bus
    await Section.save();

    return res.json({
      message: "sections updated successfully",
      Section,
    });

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg ="error in updating section";
  
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

SectionRoute.delete("/delete-section", userAuth, async (req, res) => {
  try {
    const sectionId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(sectionId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await SectionModel.findByIdAndDelete(sectionId);
    res.send("section deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting section";
  
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

SectionRoute.get("/search-section", userAuth, async (req, res) => {
  try {
    const GetSection = await SectionModel.findOne(req.body);
    res.send(GetSection);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "section data not found";
  
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

SectionRoute.get("/section-data", userAuth, async (req, res) => {
  try {
    const GetSection = await SectionModel.findOne(req.body);
    res.send(GetSection);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "section data not found";
  
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

SectionRoute.get("/sections-data", userAuth, async (req, res) => {
  try {
    const GetSection = await SectionModel.find();
    res.send(GetSection);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "sections data not found";
  
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

module.exports = SectionRoute;
