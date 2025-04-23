const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
    {
        conversationId: {  // ✅ ID of the conversation
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            
        },
        senderId: {  // ✅ ID of the sender
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            
        },
        receiverId: {  // ✅ ID of the receiver (optional for group chats)
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        message: {  // ✅ Message text
            type: String,
            
        },
        messageType: {  // ✅ Text, Image, File, etc.
            type: String,
            enum: ["text", "image", "file"],
            default: "text",
        },
        messageStatus: {  // ✅ Seen, Delivered, Sent
            type: String,
            enum: ["sent", "delivered", "seen"],
            default: "sent",
        },
        attachments: [  // ✅ Array of file/image URLs
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", MessagesSchema);
