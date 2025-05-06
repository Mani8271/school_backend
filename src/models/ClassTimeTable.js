
const mongoose = require("mongoose");

const ClassTimeTableSchema = new mongoose.Schema(
  {
    class: {
      type: String,
    },
    date: {  
      type: String,
    },
    day:
    {
      type:String,
      enum:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    },
    teacherName:
    {
      type: String,
    },
    section: {
      type: String,
     
    },
    period1: {
      type: String,
     
    },
    period2: {
      type: String,
     
    },
    break1: { // ✅ Made optional
      type: String,
    },
    period3: {
      type: String,
     
    },
    period4: {
      type: String,
     
    },
    break2: { // ✅ Made optional
      type: String,
    },
    period5: {
      type: String,
     
    },
    period6: {
      type: String,
     
    },
    break3: { // ✅ Made optional
      type: String,
    },
    period7: {
      type: String,
     
    },
    startTime:
    {
      type: String,
    },
    endTime:
    {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClassTimeTable", ClassTimeTableSchema);