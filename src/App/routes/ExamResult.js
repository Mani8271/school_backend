const express = require("express");
const ExamResultRoute = express.Router();
const {isValidObjectId, validateEditExamResultData} = require("../../utils/validation");
const ExamResultModel = require("../../models/ExamResult");
const { Error } = require("console");

ExamResultRoute.post("/add-exam-result",async (req, res) => {
    try {
      const AddExamResult = new ExamResultModel(req.body);
      await AddExamResult.save();
      res.send("Added exam result Successfully");
    } catch (error) {
      res.status(400).send("Error adding the exam result");
    }
  }
);

ExamResultRoute.patch("/update-exam-result",  async (req, res) => {
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

ExamResultRoute.delete("/delete-exam-result",  async (req, res) => {
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

ExamResultRoute.get("/search-exam-result",  async (req, res) => {
  try {
    const Getexamresult = await ExamResultModel.findOne(req.body);
    res.send(Getexamresult);
  } catch (error) {
    res.status(400).send("exam result not found");
  }
});

ExamResultRoute.get("/exam-result-data",  async (req, res) => {
  try {
    const Getexamresult = await ExamResultModel.findOne(req.body);
    res.send(Getexamresult);
  } catch (error) {
    res.status(400).send("exam result data not found");
  }
});

ExamResultRoute.get("/exams-results-data",  async (req, res) => {
  try {
    const Getexamresult = await ExamResultModel.find();
    res.send(Getexamresult);
  } catch (error) {
    res.status(400).send("exams data not found");
  }
});


module.exports = ExamResultRoute;
