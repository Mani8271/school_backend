const express = require("express");
const StaffLeavesRoute = express.Router();
const {
  validateEditStaffLeavesData,
  isValidObjectId,
} = require("../../utils/validation");
const StaffLeavesModel = require("../../models/StaffLeaveRequests");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

StaffLeavesRoute.post( "/add-staff-leave", userAuth,async (req, res) => {
    try {
      const AddLeaves= new StaffLeavesModel(req.body);
      await AddLeaves.save();
      res.send("Added LeavesSuccessfully");
    } catch (error) {
      res.status(400).send("Error adding the leave");
    }
  }
);

StaffLeavesRoute.patch("/update-leaves",userAuth,async (req, res) => {
    try {
      const leavesId = req.body._id;
      // Ensure `_id` is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(leavesId)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      // Find the Leavesfirst
      const leaves= await StaffLeavesModel.findById(leavesId);
      if (!leaves) {
        return res.status(404).json({ error: "Leaves not found" });
      }
      // ✅ Save the updated leaves
      await leaves.save();
      return res.json({
        message: "Leaves data updated successfully",
        leaves,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

StaffLeavesRoute.delete("/delete-leaves", userAuth, async (req, res) => {
  try {
    const leavesId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(leavesId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await StaffLeavesModel.findByIdAndDelete(leavesId);
    res.send("Leaves data deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the Leaves data");
  }
});

StaffLeavesRoute.get("/search-leaves", userAuth, async (req, res) => {
  try {
    const Getleavesdata = await StaffLeavesModel.findOne(req.body);
    res.send(Getleavesdata);
  } catch (error) {
    res.status(400).send("Leavesdata not found");
  }
});

StaffLeavesRoute.get("/leaves-data", userAuth, async (req, res) => {
  try {
    const Getleavesdata = await StaffLeavesModel.findOne(req.body);
    res.send(Getleavesdata);
  } catch (error) {
    res.status(400).send("Leavesdata not found");
  }
});

StaffLeavesRoute.get("/all-leaves-data", userAuth, async (req, res) => {
  try {
    const Getleavesdata = await StaffLeavesModel.find();
    res.send(Getleavesdata);
  } catch (error) {
    res.status(400).send("Leavesdata not found");
  }
});

module.exports = StaffLeavesRoute;
