const mongoose = require("mongoose");

const TeachersTimetableSchema = new mongoose.Schema(
  {
    Day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    time: {
      type: String,
      
    },
    class: {
      type: String,
      
    },
    subject: {
      type: String,
      
    },
    section:
    {
      type: String,
      
    },
    teacher: {
      type: String,
      
    },
    room:
    {
      type: String,
      
    },
    date:
    {
      type: String,
      
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TeachersTimetable", TeachersTimetableSchema);
