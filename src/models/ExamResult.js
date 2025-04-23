const mongoose = require("mongoose");

const ExamResultSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      
    },
    examType: {
      type: String,
      
    },
    class: {
      type: String,
      
    },
    section: {
      type: String,
      
    },
    lang1: {  // ✅ Changed to Number
      type: Number,
      
    },
    lang2: {  // ✅ Changed to Number
      type: Number,
      
    },
    english: {  // ✅ Changed to Number
      type: Number,
      
    },
    maths: {  // ✅ Changed to Number
      type: Number,
      
    },
    science: {  // ✅ Changed to Number
      type: Number,
      
    },
    social: {  // ✅ Changed to Number
      type: Number,
      
    },
    grade: {
      type: String,
      
    },
    date: {  // ✅ Changed to Date type
      type: Date,
      
    },
    time: {  // ✅ Enforcing HH:mm format
      type: String,
      
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExamResult", ExamResultSchema);
