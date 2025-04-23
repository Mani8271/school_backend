const express = require("express");
const ExamListRoute = express.Router();
const {isValidObjectId, validateEditExamData} = require("../../utils/validation");
const ExamListModel = require("../../models/ExamList");
const { Error } = require("console");
const { AppuserAuth } = require("../../middlewares/auth");
const path = require("path");
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

ExamListRoute.post("/add-exam",async (req, res) => {
    try {
      const AddExam = new ExamListModel(req.body);
      await AddExam.save();
      res.send("Added exam Successfully");
    } catch (error) {
      res.status(400).send("Error adding the exam");
    }
  }
);

ExamListRoute.patch("/update-exam",  async (req, res) => {
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

  } catch (error) {
    console.error("Error updating exam:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

ExamListRoute.delete("/delete-exam",  async (req, res) => {
  try {
    const examId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(examId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await ExamListModel.findByIdAndDelete(examId);
    res.send("exam deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the exam");
  }
});

ExamListRoute.get("/search-exam",  async (req, res) => {
  try {
    const Getexam = await ExamListModel.findOne(req.body);
    res.send(Getexam);
  } catch (error) {
    res.status(400).send("exam not found");
  }
});

ExamListRoute.get("/exam-data",  async (req, res) => {
  try {
    const Getexam = await ExamListModel.findOne(req.body);
    res.send(Getexam);
  } catch (error) {
    res.status(400).send("exam data not found");
  }
});

ExamListRoute.get("/exams-data",  async (req, res) => {
  try {
    const Getexam = await ExamListModel.find();
    res.send(Getexam);
  } catch (error) {
    res.status(400).send("exams data not found");
  }
});



module.exports = ExamListRoute;
