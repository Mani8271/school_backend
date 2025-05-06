const express = require("express");
const ExamListRoute = express.Router();
const {isValidObjectId, validateEditExamData} = require("../../utils/validation");
const ExamListModel = require("../../models/ExamList");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer")

const upload = multer({
  storage: multer.diskStorage({
      destination: "./uploads",
      filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
      },
  }),
  fileFilter: (req, file, cb) => {
      if (path.extname(file.originalname).toLowerCase() !== ".csv") {
          return cb(new Error("Only CSV files are allowed"), false);
      }
      cb(null, true);
  },
});

ExamListRoute.post("/add-exam",userAuth,async (req, res) => {
    try {
      const AddExam = new ExamListModel(req.body);
      await AddExam.save();
      res.send("Added exam Successfully");
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding exam";
    
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

ExamListRoute.patch("/update-exam", userAuth, async (req, res) => {
  try {
    
    const examId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(examId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the bus by ID first
    let exams = await ExamListModel.findById(examId);
    if (!exams) {
      return res.status(404).json({ error: " exam not found" });
    }

    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
        exams[key] = req.body[key];
    });

    // Save updated bus
    await exams.save();

    return res.json({
      message: "exam updated successfully",
      exams,
    });

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in exam update";
  
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

ExamListRoute.delete("/delete-exam", userAuth, async (req, res) => {
  try {
    const examId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(examId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await ExamListModel.findByIdAndDelete(examId);
    res.send("exam deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting exam";
  
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

ExamListRoute.get("/search-exam", userAuth, async (req, res) => {
  try {
    const Getexam = await ExamListModel.findOne(req.body);
    res.send(Getexam);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "exam data not found";
  
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

ExamListRoute.get("/exam-data", userAuth, async (req, res) => {
  try {
    const Getexam = await ExamListModel.findOne(req.body);
    res.send(Getexam);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "exam data not found";
  
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

ExamListRoute.get("/exams-data", userAuth, async (req, res) => {
  try {
    const Getexam = await ExamListModel.find();
    res.send(Getexam);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "exams data not found";
  
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

ExamListRoute.post("/bulk-upload", userAuth, upload.single("file"), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json(errorResponse("No file uploaded"));
      }

      const filePath = req.file.path;
      const exams = [];

      await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
              .pipe(csv())
              .on("data", (row) => {
                  if (Object.values(row).some(value => value && value.trim() !== "")) {
                      row._id = row._id?.trim() || null;
                      exams.push(row);
                  }
              })
              .on("end", resolve)
              .on("error", reject);
      });

      if (exams.length === 0) {
          return res.status(400).json(errorResponse("CSV file is empty or invalid"));
      }
      await Promise.all(
          exams.map(async (exam) => {
              if (exam._id) {
                  await ExamListModel.findOneAndUpdate({ _id: exam._id }, exam, { upsert: true });
              } else {
                  await ExamListModel.create(exam);
              }
          })
      );

      return res.status(200).json(successResponse("Exams uploaded successfully"));
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in uploading csv";
  
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

module.exports = ExamListRoute;
