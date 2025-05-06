const express = require("express");
const NotificationsRoute = express.Router();
const {isValidObjectId} = require("../../utils/validation");
const NotificationsModel = require("../../models/Notifications");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

NotificationsRoute.get("/all-notifications", userAuth, async (req, res) => {
  try {
    const GetNotifications = await NotificationsModel.find();
    res.send(GetNotifications);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "notifications not found";
  
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map(err => err.message).join(", ");
    } else if (error.message) {
      msg = error.message;
    }
  
    res.status(400).json({ errors: [msg], status: "unprocessable_entity" });
  }
});

module.exports = NotificationsRoute;
