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
  } catch (error) {
    res.status(400).send("notifications not found");
  }
});

module.exports = NotificationsRoute;
