const express = require("express");
const ExamResultRoute = express.Router();
const {isValidObjectId, validateEditExamResultData} = require("../../utils/validation");
const ExamResultModel = require("../../models/ExamResult");
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

ExamResultRoute.post("/add-exam-result",userAuth,async (req, res) => {
    try {
      const AddExamResult = new ExamResultModel(req.body);
      await AddExamResult.save();
      res.send("Added exam result Successfully");
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding exam result";
    
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

ExamResultRoute.patch("/update-exam-result", userAuth, async (req, res) => {
  try {
    
    const resultId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(resultId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the bus by ID first
    let results = await ExamResultModel.findById(resultId);
    if (!results) {
      return res.status(404).json({ error: " exam not found" });
    }

    // ✅ Update fields from request body
    Object.keys(req.body).forEach((key) => {
        results[key] = req.body[key];
    });

    await results.save();

    return res.json({
      message: "exam results updated successfully",
      results,
    });

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in updating exam result";
  
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

ExamResultRoute.delete("/delete-exam-result", userAuth, async (req, res) => {
  try {
    const resultId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(resultId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await ExamResultModel.findByIdAndDelete(resultId);
    res.send("exam result deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting exam result";
  
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

ExamResultRoute.get("/search-exam-result", userAuth, async (req, res) => {
  try {
    const Getexamresult = await ExamResultModel.findOne(req.body);
    res.send(Getexamresult);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "exam result not found";
  
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

ExamResultRoute.get("/exam-result-data", userAuth, async (req, res) => {
  try {
    const Getexamresult = await ExamResultModel.findOne(req.body);
    res.send(Getexamresult);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "exam result not found";
  
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

ExamResultRoute.get("/exams-results-data", userAuth, async (req, res) => {
  try {
    const Getexamresult = await ExamResultModel.find();
    res.send(Getexamresult);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "exams result data";
  
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

ExamResultRoute.post("/bulk-upload", userAuth, upload.single("file"), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json(errorResponse("No file uploaded"));
      }

      const filePath = req.file.path;
      const examResults = [];

      await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
              .pipe(csv())
              .on("data", (row) => {
                  if (Object.values(row).some(value => value && value.trim() !== "")) {
                      row._id = row._id?.trim() || null;
                      examResults.push(row);
                  }
              })
              .on("end", resolve)
              .on("error", reject);
      });

      if (examResults.length === 0) {
          return res.status(400).json(errorResponse("CSV file is empty or invalid"));
      }

      await Promise.all(
          examResults.map(async (exam) => {
              if (exam._id) {
                  await ExamResultModel.findOneAndUpdate({ _id: exam._id }, exam, { upsert: true });
              } else {
                  await ExamResultModel.create(exam);
              }
          })
      );

      return res.status(200).json(successResponse("Exam results uploaded successfully"));
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in upload csv";
  
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

module.exports = ExamResultRoute;
