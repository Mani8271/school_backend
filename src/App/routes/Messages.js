const express = require("express");
const MessagesRoute = express.Router();
const { isValidObjectId } = require("../../utils/validation");
const MessageModel = require("../../models/Message");
const ConversationModel = require("../../models/Conversation");
const { AppuserAuth } = require("../../middlewares/auth");

// ✅ Send a new message
MessagesRoute.post("/send",  async (req, res) => {
    try {
        const { conversationId, senderId, message, messageType, attachments } = req.body;

        if (!isValidObjectId(conversationId) || !isValidObjectId(senderId)) {
            return res.status(400).json({ error: "Invalid conversation or sender ID format" });
        }

        const conversation = await ConversationModel.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const newMessage = new MessageModel({
            conversationId,
            senderId,
            message,
            messageType: messageType || "text",
            attachments: attachments || [],
        });

        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully", newMessage });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Get all messages in a conversation
MessagesRoute.get("/:conversationId",  async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!isValidObjectId(conversationId)) {
            return res.status(400).json({ error: "Invalid conversation ID format" });
        }

        const messages = await MessageModel.find({ conversationId }).sort({ createdAt: 1 });
        res.json(messages);

    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Delete a message
MessagesRoute.delete("/delete/:messageId",  async (req, res) => {
    try {
        const { messageId } = req.params;

        if (!isValidObjectId(messageId)) {
            return res.status(400).json({ error: "Invalid message ID format" });
        }

        await MessageModel.findByIdAndDelete(messageId);
        res.json({ message: "Message deleted successfully" });

    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Update message status (e.g., seen, delivered)
MessagesRoute.patch("/status/:messageId",  async (req, res) => {
    try {
        const { messageId } = req.params;
        const { messageStatus } = req.body;

        if (!isValidObjectId(messageId)) {
            return res.status(400).json({ error: "Invalid message ID format" });
        }

        if (!["sent", "delivered", "seen"].includes(messageStatus)) {
            return res.status(400).json({ error: "Invalid message status" });
        }

        const updatedMessage = await MessageModel.findByIdAndUpdate(
            messageId,
            { messageStatus },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.json({ message: "Message status updated", updatedMessage });

    } catch (error) {
        console.error("Error updating message status:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = MessagesRoute;
