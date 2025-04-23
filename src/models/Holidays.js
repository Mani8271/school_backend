const mongoose = require("mongoose");

const HolidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
     
      // Removed unique constraint to allow repeated holiday names in different years
    },
    description: {
      type: String,
    },
    date: {
      type: Date, // ✅ Changed to Date type for better handling
     
    },
    day: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ Middleware to set 'day' automatically from 'date'
HolidaySchema.pre("save", function (next) {
  if (this.date) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.day = daysOfWeek[this.date.getDay()];
  }
  next();
});

module.exports = mongoose.model("Holidays", HolidaySchema);
