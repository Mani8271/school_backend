const express = require("express");
const ConversationsRoute = express.Router();
const { isValidObjectId } = require("../../utils/validation");
const ConversationModel = require("../../models/Conversations");
const { userAuth } = require("../../middlewares/auth");

// ✅ Create a new conversation
ConversationsRoute.post("/create", userAuth, async (req, res) => {
    try {
        const { participants } = req.body;

        if (!participants || participants.length < 2) {
            return res.status(400).json({ error: "A conversation requires at least two participants" });
        }

        const newConversation = new ConversationModel({ participants });
        await newConversation.save();
        res.status(201).json({ message: "Conversation created successfully", conversation: newConversation });

    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Get a conversation by ID
ConversationsRoute.get("/:conversationId", userAuth, async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!isValidObjectId(conversationId)) {
            return res.status(400).json({ error: "Invalid conversation ID format" });
        }

        const conversation = await ConversationModel.findById(conversationId).populate("participants", "name email");
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        res.json(conversation);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Get all conversations of a user
ConversationsRoute.get("/user/:userId", userAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const conversations = await ConversationModel.find({ participants: userId }).populate("participants", "name email");
        res.json(conversations);

    } catch (error) {
        console.error("Error fetching user conversations:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Delete a conversation
ConversationsRoute.delete("/delete/:conversationId", userAuth, async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!isValidObjectId(conversationId)) {
            return res.status(400).json({ error: "Invalid conversation ID format" });
        }

        await ConversationModel.findByIdAndDelete(conversationId);
        res.json({ message: "Conversation deleted successfully" });

    } catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = ConversationsRoute;
