const express = require("express");
const homeworkRoute = express.Router();
const {isValidObjectId,validateEdithomeworkData} = require("../../utils/validation");
const homeworksModel = require("../../models/StudentHomework");
const { Error } = require("console");

const multer = require("multer");
const path = require("path")
const fs = require("fs")
const storagePath = path.join(__dirname, "../../../src/storage/homework");

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

homeworkRoute.post("/upload-homework",upload.single("homeworkfile"),async (req, res) => {
    try {
        if (req.file) {
            // Store the relative file path in the database
            req.body.homeworkfile = `${req.file.filename}`;
          } else {
            console.log("No file uploaded");
          }
      const Addhomework = new homeworksModel(req.body);
      await Addhomework.save();
      res.send("Added homework Successfully");
    } catch (error) {
      res.status(400).send("Error adding the homework");
    }
  }
);

homeworkRoute.patch("/update-homework-data", upload.single("homeworkfile"),  async (req, res) => {
  try {
    const homeworkId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(homeworkId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    // Find the homework by ID first
    let homework = await homeworksModel.findById(homeworkId);
    if (!homework) {
      return res.status(404).json({ error: "homework not found" });
    }
    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
      if (key !== "homeworkfile") homework[key] = req.body[key];
    });
    // ✅ Update homework image if uploaded
    if (req.file) {
      homework.homeworkfile = req.file.filename; // Store the file path
    }
    // Save updated homework
    await homework.save();
    return res.json({
      message: "homework data updated successfully",
      homework,
    });
  } catch (error) {
    console.error("Error updating homework:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

homeworkRoute.delete("/delete-homework-data",  async (req, res) => {
  try {
    const homeworkId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(homeworkId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await homeworksModel.findByIdAndDelete(homeworkId);
    res.send("homework data deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the homework data");
  }
});

homeworkRoute.get("/search-homework-data",  async (req, res) => {
  try {
    const Gethomeworkdata = await homeworksModel.findOne(req.body);
    res.send(Gethomeworkdata);
  } catch (error) {
    res.status(400).send("homework data not found");
  }
});

homeworkRoute.get("/homework",  async (req, res) => {
  try {
    const Gethomeworkdata = await homeworksModel.findOne(req.body);
    res.send(Gethomeworkdata);
  } catch (error) {
    res.status(400).send("homework data not found");
  }
});

homeworkRoute.get("/homeworks",  async (req, res) => {
  try {
    const Gethomeworkdata = await homeworksModel.find();
    res.send(Gethomeworkdata);
  } catch (error) {
    res.status(400).send("homework data not found");
  }
});

module.exports = homeworkRoute;
