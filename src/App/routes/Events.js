const express = require("express");
const EventsRoute = express.Router();
const {
  validateEditEventsData,
  isValidObjectId,
} = require("../../utils/validation");
const EventsModel = require("../../models/Events");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose= require("mongoose");
const { Error } = require("console");
const { AppuserAuth } = require("../../middlewares/auth");
const storagePath = path.join(__dirname, "../../../src/storage/eventimages");

if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
  console.log("Directory created:", storagePath);
} else {
  console.log("Directory already exists:", storagePath);
}

// Multer storage configuration
const imageconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storagePath); // Use absolute path
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({
  storage: imageconfig,
  limits: {
    fileSize: 1000000000,
  },
});

EventsRoute.post( "/add-event",  upload.single("eventImage"), async (req, res) => {
    try {
      if (req.file) {
        // Store the relative file path in the database
        req.body.eventImage = `${req.file.filename}`;
      } else {
        console.log("No file uploaded");
      }
      const AddEvent = new EventsModel(req.body);
      await AddEvent.save();
      res.send("Added Event Successfully");
    } catch (error) {
      res.status(400).send("Error adding the event");
    }
  }
);

EventsRoute.patch("/update-event-data",  upload.single("eventImage"), async (req, res) => {
  try {
      const eventId = req.body._id;

      // Ensure `_id` is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
          return res.status(400).json({ error: "Invalid ID format" });
      }

      // Find the event first
      const event = await EventsModel.findById(eventId);
      if (!event) {
          return res.status(404).json({ error: "Event not found" });
      }

      // ✅ Handle Event Image Update
      if (req.file) {
          // Get old image path
          const oldImagePath = path.join(__dirname, "../../../src/storage/eventimages", event.eventImage);

          // Delete old image if it exists
          if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log("✅ Old event image deleted:", event.eventImage);
          }

          // Assign new image filename
          event.eventImage = req.file.filename;
      }

      // ✅ Update other fields from request body
      Object.keys(req.body).forEach((key) => {
          if (key !== "eventImage") event[key] = req.body[key];
      });

      // ✅ Save the updated event
      await event.save();

      return res.json({
          message: "Event data updated successfully",
          event,
      });

  } catch (error) {
      console.error("Error updating event:", error);
      return res.status(500).json({ error: "Something went wrong" });
  }
});
EventsRoute.delete("/delete-event-data",  async (req, res) => {
  try {
    const eventId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(eventId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await EventsModel.findByIdAndDelete(eventId);
    res.send("event data deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the event data");
  }
});

EventsRoute.get("/search-event-data",  async (req, res) => {
  try {
    const GetEventdata = await EventsModel.findOne(req.body);
    res.send(GetEventdata);
  } catch (error) {
    res.status(400).send("event data not found");
  }
});

EventsRoute.get("/event-data",  async (req, res) => {
  try {
    const GetEventdata = await EventsModel.findOne(req.body);
    res.send(GetEventdata);
  } catch (error) {
    res.status(400).send("event data not found");
  }
});

EventsRoute.get("/events-data",  async (req, res) => {
  try {
    const GetEventdata = await EventsModel.find();
    res.send(GetEventdata);
  } catch (error) {
    res.status(400).send("event data not found");
  }
});

module.exports = EventsRoute;
