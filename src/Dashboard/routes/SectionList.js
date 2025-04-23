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
    } catch (error) {
      res.status(400).send("Error adding the sections");
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

  } catch (error) {
    console.error("Error updating sections:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

SectionRoute.delete("/delete-section", userAuth, async (req, res) => {
  try {
    const sectionId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(sectionId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await SectionModel.findByIdAndDelete(ClassId);
    res.send("section deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the section");
  }
});

SectionRoute.get("/search-section", userAuth, async (req, res) => {
  try {
    const GetSection = await SectionModel.findOne(req.body);
    res.send(GetSection);
  } catch (error) {
    res.status(400).send("section not found");
  }
});

SectionRoute.get("/section-data", userAuth, async (req, res) => {
  try {
    const GetSection = await SectionModel.findOne(req.body);
    res.send(GetSection);
  } catch (error) {
    res.status(400).send("section data not found");
  }
});

SectionRoute.get("/sections-data", userAuth, async (req, res) => {
  try {
    const GetSection = await SectionModel.find();
    res.send(GetSection);
  } catch (error) {
    res.status(400).send("sections data not found");
  }
});

module.exports = SectionRoute;
