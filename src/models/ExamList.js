const mongoose = require("mongoose");

const ExamListSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      
    },
    section: {  
      type: String,
      
    },
    examType: {
      type: String,
      
    },
    date: {  // ✅ Changed to Date type
      type: Date,
      
    },
    timeFrom: {  // ✅ Enforcing HH:mm format
      type: String,
      
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, 
    },
    timeTo: {  // ✅ Enforcing HH:mm format
      type: String,
      
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, 
    },
    subject: {
      type: String,
      
    },
    lastSubmissionDate: {  // ✅ Changed to Date type
      type: Date,
      
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExamList", ExamListSchema);
