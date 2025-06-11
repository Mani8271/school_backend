const express = require("express");
const ClassRoute = express.Router();
const {isValidObjectId} = require("../../utils/validation");
const ClassesModel = require("../../models/Classes");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const moment = require("moment");
const NotificationsModel = require("../../models/Notifications");

ClassRoute.post("/add-class",userAuth,async (req, res) => {
    try {
      const AddClass = new ClassesModel(req.body);
      await AddClass.save();
      const now = moment();
                const newNotification = new NotificationsModel({
                  title: "New Class Added",
                  description: `Class ${
                    req.body.className || ""
                  } has been added successfully.`,
                  date: now.format("YYYY-MM-DD"),
                  time: now.format("h:mm A"),
                });
                await newNotification.save();
                console.log("newNotification", newNotification);
      res.send("Added class Successfully");
    }catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "Error Adding class";
    
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

ClassRoute.patch("/update-class", userAuth, async (req, res) => {
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

    const now = new Date();
              const newNotification = new NotificationsModel({
                title: "Class Updated",
                description: `Class ${Class.className || ClassId} has been updated.`,
                date: now.format("YYYY-MM-DD"),
                time: now.format("h:mm A"),
              });
        
              await newNotification.save();

    return res.json({
      message: "class updated successfully",
      Class,
    });

  }catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error update class";
  
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

ClassRoute.delete("/delete-class", userAuth, async (req, res) => {
  try {
    const ClassId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(ClassId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await ClassesModel.findByIdAndDelete(ClassId);

    const now = moment();
                const notification = new NotificationsModel({
                  title: "Class Deleted",
                  description: `Class with ID ${ClassId} has been deleted from the system.`,
                  date: now.format("YYYY-MM-DD"),
                  time: now.format("h:mm A"),
                });
            
                // Save notification
                await notification.save();
    res.send("class deleted successfully");
  }catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error delete class";
  
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

ClassRoute.get("/search-class", userAuth, async (req, res) => {
  try {
    const GetClass = await ClassesModel.findOne(req.body);
    res.send(GetClass);
  }catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "class data not found";
  
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

ClassRoute.get("/class-data", userAuth, async (req, res) => {
  try {
    const GetClass = await ClassesModel.findOne(req.body);
    res.send(GetClass);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "class data not found";
  
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

ClassRoute.get("/classes-data", userAuth, async (req, res) => {
  try {
    const GetClass = await ClassesModel.find();
    res.send(GetClass);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "classes data not found";
  
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

module.exports = ClassRoute;
