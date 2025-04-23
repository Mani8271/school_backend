const express = require("express");
const NonTeachingStaffRoute = express.Router();
const bcrypt = require("bcrypt");
const { isValidObjectId } = require("../../utils/validation");
const NonTeachingStaffModel = require("../../models/NonTeachingStaff");
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
const path = require("path");


const storagePath = path.join(__dirname, "../../../src/storage/userdp");

// Ensure the storage directory exists
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
  console.log("Directory created:", storagePath);
} else {
  console.log("Directory already exists:", storagePath);
}

// Multer storage configuration
const imageconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storagePath);
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: imageconfig,
  limits: { fileSize: 1000000000 },
});

// Add new staff
NonTeachingStaffRoute.post("/add-staff", upload.single("ProfilePicture"), async (req, res) => {
  try {
    if (req.file) {
      // Store the relative file path in the database
      req.body.ProfilePicture = `${req.file.filename}`;
    } else {
      console.log("No file uploaded");
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashPassword;
    const AddStaff = new NonTeachingStaffModel(req.body);
    await AddStaff.save();
    res.send("Added staff successfully");
  } catch (error) {
    res.status(400).send("Error adding the staff");
  }
});

// Staff login
NonTeachingStaffRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await NonTeachingStaffModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Update staff details
NonTeachingStaffRoute.patch("/update-staff", upload.single("ProfilePicture"), async (req, res) => {
  try {
    const staffId = req.body._id;

    if (!isValidObjectId(staffId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    let staff = await NonTeachingStaffModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    if (req.file) {
      const oldImagePath = path.join(storagePath, staff.ProfilePicture);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("Old image deleted:", staff.ProfilePicture);
      }
      staff.ProfilePicture = req.file.filename;
    }

    Object.keys(req.body).forEach((key) => {
      if (key !== "_id") staff[key] = req.body[key];
    });
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(req.body.password, salt);
    }    
    await staff.save();

    return res.json({ message: "Staff updated successfully", staff });
  } catch (error) {
    console.error("Error updating staff:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Delete staff
NonTeachingStaffRoute.delete("/delete-staff", async (req, res) => {
  try {
    const staffId = req.body._id;
    if (!isValidObjectId(staffId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await NonTeachingStaffModel.findByIdAndDelete(staffId);
    res.send("Staff deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting the staff");
  }
});

// Search for a staff member
NonTeachingStaffRoute.get("/search-staff",  async (req, res) => {
  try {
    const GetStaff = await NonTeachingStaffModel.findOne(req.body);
    res.send(GetStaff);
  } catch (error) {
    res.status(400).send("staff not found");
  }
});

// Fetch staff details
NonTeachingStaffRoute.get("/staff-data",  async (req, res) => {
  try {
    const GetStaff = await NonTeachingStaffModel.findOne(req.body);
    res.send(GetStaff);
  } catch (error) {
    res.status(400).send("staff data not found");
  }
});

// Get profile (user details should be available in req.user)
NonTeachingStaffRoute.get("/profile", async (req, res) => {
  try {
    const { _id } = req.query;
    const user = await NonTeachingStaffModel.findOne({ _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile data", error });
  }
});

// Fetch all staff members
NonTeachingStaffRoute.get("/all-staff-data", async (req, res) => {
  try {
    const staffList = await NonTeachingStaffModel.find();
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving staff data", error });
  }
});

// Forgot password
NonTeachingStaffRoute.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await NonTeachingStaffModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await NonTeachingStaffModel.updateOne({ email }, { $set: { password: hashedPassword } });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
});

// Get logged-in user details without authentication
NonTeachingStaffRoute.get("/get-logged-in-user-details", async (req, res) => {
  try {
    const { _id } = req.query;
    const user = await NonTeachingStaffModel.findOne({ _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = NonTeachingStaffRoute;
