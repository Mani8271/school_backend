
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
        eventImage: {
            type: String,
        },
        eventName: {
            type: String, // Stores the last message for quick access
        },
        date: {
            type:String, // Timestamp of the last message
        },
        time:
        {
            type: String, 
        },
        description:
        {
            type: String, 
        }    },
    { timestamps: true } // Automatically creates createdAt & updatedAt
);

module.exports = mongoose.model("events", ConversationSchema);