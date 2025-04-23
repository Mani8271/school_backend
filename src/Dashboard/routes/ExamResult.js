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
    } catch (error) {
      res.status(400).send("Error adding the exam result");
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

  } catch (error) {
    console.error("Error updating exam result:", error);
    return res.status(500).json({ error: "Something went wrong" });
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
  } catch (error) {
    res.status(400).send("Error deleting  the exam result");
  }
});

ExamResultRoute.get("/search-exam-result", userAuth, async (req, res) => {
  try {
    const Getexamresult = await ExamResultModel.findOne(req.body);
    res.send(Getexamresult);
  } catch (error) {
    res.status(400).send("exam result not found");
  }
});

ExamResultRoute.get("/exam-result-data", userAuth, async (req, res) => {
  try {
    const Getexamresult = await ExamResultModel.findOne(req.body);
    res.send(Getexamresult);
  } catch (error) {
    res.status(400).send("exam result data not found");
  }
});

ExamResultRoute.get("/exams-results-data", userAuth, async (req, res) => {
  try {
    const Getexamresult = await ExamResultModel.find();
    res.send(Getexamresult);
  } catch (error) {
    res.status(400).send("exams data not found");
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
  } catch (error) {
      console.error("Error in bulk upload:", error);
      return res.status(500).json(errorResponse("Error processing exam results upload"));
  }
});

module.exports = ExamResultRoute;
