const express = require("express");
const NoticeBoardRoute = express.Router();
const {isValidObjectId,validateEditNoticeboardData} = require("../../utils/validation");
const NoticeBoardModel = require("../../models/Noticeboard");
const { Error } = require("console");
const { AppuserAuth } = require("../../middlewares/auth");
const multer = require("multer");
const path = require("path")
const fs = require("fs")
const storagePath = path.join(__dirname, "../../../src/storage/noticefiles");

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

NoticeBoardRoute.post("/add-noticeboard",upload.single("noticeImage"),async (req, res) => {
    try {
        if (req.file) {
            // Store the relative file path in the database
            req.body.noticeImage = `${req.file.filename}`;
          } else {
            console.log("No file uploaded");
          }
      const Addnoticeboard = new NoticeBoardModel(req.body);
      await Addnoticeboard.save();
      res.send("Added noticeboard Successfully");
    } catch (error) {
      res.status(400).send("Error adding the noticeboard");
    }
  }
);

NoticeBoardRoute.patch("/update-noticeboard-data", upload.single("noticeImage"),  async (req, res) => {
  try {
    const noticeboardId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(noticeboardId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the noticeboard by ID
    let noticeboard = await NoticeBoardModel.findById(noticeboardId);
    if (!noticeboard) {
      return res.status(404).json({ error: "Noticeboard not found" });
    }

    // ✅ Update other fields from request body (except noticeImage)
    Object.keys(req.body).forEach((key) => {
      if (key !== "noticeImage") noticeboard[key] = req.body[key];
    });

    // ✅ Handle Notice Image Update
    if (req.file) {
      // Get old image path
      const oldImagePath = path.join(__dirname, "../../../src/storage/noticefiles", noticeboard.noticeImage);

      // Delete old image if it exists
      if (noticeboard.noticeImage && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("✅ Old notice image deleted:", noticeboard.noticeImage);
      }

      // Assign new image filename
      noticeboard.noticeImage = req.file.filename;
    }

    // Save updated noticeboard data
    await noticeboard.save();

    return res.json({
      message: "Noticeboard data updated successfully",
      noticeboard,
    });

  } catch (error) {
    console.error("Error updating noticeboard:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

NoticeBoardRoute.delete("/delete-noticeboard-data",  async (req, res) => {
  try {
    const noticeboardId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(noticeboardId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await NoticeBoardModel.findByIdAndDelete(noticeboardId);
    res.send("noticeboard data deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the noticeboard data");
  }
});

NoticeBoardRoute.get("/search-noticeboard-data",  async (req, res) => {
  try {
    const Getnoticeboarddata = await NoticeBoardModel.findOne(req.body);
    res.send(Getnoticeboarddata);
  } catch (error) {
    res.status(400).send("noticeboard data not found");
  }
});

NoticeBoardRoute.get("/noticeboard",  async (req, res) => {
  try {
    const Getnoticeboarddata = await NoticeBoardModel.findOne(req.body);
    res.send(Getnoticeboarddata);
  } catch (error) {
    res.status(400).send("noticeboard data not found");
  }
});

NoticeBoardRoute.get("/noticeboards",  async (req, res) => {
  try {
    const Getnoticeboarddata = await NoticeBoardModel.find();
    res.send(Getnoticeboarddata);
  } catch (error) {
    res.status(400).send("noticeboard data not found");
  }
});

module.exports = NoticeBoardRoute;
