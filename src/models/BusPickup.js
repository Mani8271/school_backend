const mongoose = require("mongoose");

const BusPickupSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
        },
        address: {  // ✅ Change type from Number to String
           type: String,
        },
        status: {
           type: String,
           enum: ["Picked", "Drop", "Absent"] // ✅ Ensures only valid values are used
        },
        profilePicture: {
          type: String,
          
        }
    },
    {
        timestamps: true // ✅ Adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("BusPickup", BusPickupSchema);
