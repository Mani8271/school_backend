const express = require("express");
const NoticeBoardRoute = express.Router();
const {isValidObjectId,validateEditNoticeboardData} = require("../../utils/validation");
const NoticeBoardModel = require("../../models/Noticeboard");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
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

NoticeBoardRoute.post("/add-noticeboard",userAuth,upload.single("noticeImage"),async (req, res) => {
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
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding notice";
    
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

NoticeBoardRoute.patch("/update-noticeboard-data", upload.single("noticeImage"), userAuth, async (req, res) => {
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
      const oldImagePath = path.join(__dirname, "../../../src/storage/noticeboardimages", noticeboard.noticeImage);

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

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in update notice";
  
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

NoticeBoardRoute.delete("/delete-noticeboard-data", userAuth, async (req, res) => {
  try {
    const noticeboardId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(noticeboardId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await NoticeBoardModel.findByIdAndDelete(noticeboardId);
    res.send("noticeboard data deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting notice";
  
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

NoticeBoardRoute.get("/search-noticeboard-data", userAuth, async (req, res) => {
  try {
    const Getnoticeboarddata = await NoticeBoardModel.findOne(req.query);
    res.send(Getnoticeboarddata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "notice not found";
  
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

NoticeBoardRoute.get("/noticeboard", userAuth, async (req, res) => {
  try {
    const Getnoticeboarddata = await NoticeBoardModel.findOne(req.body);
    res.send(Getnoticeboarddata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "notice data not found";
  
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

NoticeBoardRoute.get("/noticeboards", userAuth, async (req, res) => {
  try {
    const Getnoticeboarddata = await NoticeBoardModel.find();
    res.send(Getnoticeboarddata);
    console.log(Getnoticeboarddata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "notices data not found";
  
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

module.exports = NoticeBoardRoute;
