const express = require("express");
const ClassRoute = express.Router();
const {isValidObjectId} = require("../../utils/validation");
const ClassesModel = require("../../models/Classes");
const { Error } = require("console");


ClassRoute.post("/add-class",async (req, res) => {
    try {
      const AddClass = new ClassesModel(req.body);
      await AddClass.save();
      res.send("Added class Successfully");
    }catch (error) {
      console.error("❌ Error occurred while saving class:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
  
      res.status(400).json({
        errors: [`Error saving the class: ${error.message}`],
        status: "unprocessable_entity"
      });
    }
  }
);

ClassRoute.patch("/update-class",  async (req, res) => {
  try {
    
    const ClassId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(ClassId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the bus by ID first
    let Class = await ClassesModel.findById(ClassId);
    if (!Class) {
      return res.status(404).json({ error: " class not found" });
    }

    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
        Class[key] = req.body[key];
    });

    // Save updated bus
    await Class.save();

    return res.json({
      message: "class updated successfully",
      Class,
    });

  } catch (error) {
    console.error("Error updating class:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

ClassRoute.delete("/delete-class",  async (req, res) => {
  try {
    const ClassId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(ClassId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await ClassesModel.findByIdAndDelete(ClassId);
    res.send("class deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the class");
  }
});

ClassRoute.get("/search-class",  async (req, res) => {
  try {
    const GetClass = await ClassesModel.findOne(req.body);
    res.send(GetClass);
  } catch (error) {
    res.status(400).send("class not found");
  }
});

ClassRoute.get("/class-data",  async (req, res) => {
  try {
    const GetClass = await ClassesModel.findOne(req.body);
    res.send(GetClass);
  } catch (error) {
    res.status(400).send("class data not found");
  }
});

ClassRoute.get("/classes-data",  async (req, res) => {
  try {
    const GetClass = await ClassesModel.find();
    res.send(GetClass);
  } catch (error) {
    res.status(400).send("classes data not found");
  }
});

module.exports = ClassRoute;
