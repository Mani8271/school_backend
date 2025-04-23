const mongoose = require("mongoose");

const NotificationsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      
      trim: true, // Removes unnecessary spaces
    },
    description: {
      type: String,
      
      trim: true,
    },
    date: {
      type: String, 
      
    },
    time: {
      type: String, 
      
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Notifications", NotificationsSchema);
