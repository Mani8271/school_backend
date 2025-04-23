const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",  // Reference to the User model
                
            }
        ],
        lastMessage: {
            type: String, // Stores the last message for quick access
        },
        lastMessageAt: {
            type: Date, // Timestamp of the last message
        }
    },
    { timestamps: true } // Automatically creates `createdAt` & `updatedAt`
);

module.exports = mongoose.model("Conversation", ConversationSchema);
