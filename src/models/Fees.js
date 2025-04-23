const mongoose = require("mongoose");

const FeesSchema = new mongoose.Schema(
  {
    admissionNumber: {
      type: String,
      
      unique: true,  // ✅ Ensures each student has a unique admission number
    },
    studentName: {
      type: String,
      
    },
    class: {
      type: String,
      
    },
    section: {
      type: String,
      
    },
    tutionFee: {  // ✅ Changed to Number
      type: Number,
      default: 0,
    },
    transportFee: {  // ✅ Changed to Number
      type: Number,
      default: 0,
    },
    stationaryFee: {  // ✅ Changed to Number
      type: Number,
      default: 0,
    },
    admissionFee: {  // ✅ Changed to Number
      type: Number,
      default: 0,
    },
    otherFees: {  // ✅ Changed to Number
      type: Number,
      default: 0,
    },
    status: {
      type: String,
        // ✅ Required to avoid undefined status
      enum: ["Unpaid", "Paid"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fees", FeesSchema);
