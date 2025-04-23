const express = require("express");
const TeachersRoute = express.Router();
const {isValidObjectId,validateEditTeachersData,} = require("../../utils/validation");
const TeachersModel = require("../../models/TeachingStaff");
const { Error } = require("console");
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");


const storagePath = path.join(__dirname, "../../../src/storage/userdp");

if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
  console.log("Directory created:", storagePath);
} else {
  console.log("Directory already exists:", storagePath);
}

// Multer storage configuration
const imageconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storagePath); // Use absolute path
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({
  storage: imageconfig,
  limits: {
    fileSize: 1000000000,
  },
});

TeachersRoute.post("/add-teacher", upload.single("ProfilePicture"), async (req, res) => {
  try {
    if (req.file) {
      // Store the relative file path in the database
      req.body.ProfilePicture = `${req.file.filename}`;
    } else {
      console.log("No file uploaded");
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashPassword;
    const AddClassTimeTable = new TeachersModel(req.body);
    await AddClassTimeTable.save();
    res.send("Added teacher Successfully");
  } catch (error) {
    res.status(400).send("Error adding the class time table");
  }
});

TeachersRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await TeachersModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
     // Secure cookie
    res.json({ message: "Login successful",});
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});



TeachersRoute.patch("/update-teacher",  upload.single("ProfilePicture"), async (req, res) => {
  try {
    const teacherId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(teacherId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the teacher by ID
    let teacher = await TeachersModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // ✅ Handle Profile Picture Update
    if (req.file) {
      // Get old image path
      const oldImagePath = path.join(__dirname, "../../../src/storage/teacherimages", teacher.ProfilePicture);

      // Delete old image if it exists
      if (teacher.ProfilePicture && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("✅ Old image deleted:", teacher.ProfilePicture);
      }

      // Assign new image filename
      teacher.ProfilePicture = req.file.filename;
    }

    // ✅ Update other fields from request body
    Object.keys(req.body).forEach((key) => {
      teacher[key] = req.body[key];
    });
if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(req.body.password, salt);
    } 
    // Save updated teacher data
    await teacher.save();

    return res.json({
      message: "Teacher updated successfully",
      teacher,
    });

  } catch (error) {
    console.error("Error updating teacher:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

TeachersRoute.delete("/delete-teacher",  async (req, res) => {
  try {
    const teacherId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(teacherId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await TeachersModel.findByIdAndDelete(teacherId);
    res.send("teacher deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the teacher");
  }
});

TeachersRoute.get("/search-teacher",  async (req, res) => {
  try {
    const GetTeacher = await TeachersModel.findOne(req.body);
    res.send(GetTeacher);
  } catch (error) {
    res.status(400).send("teacher not found");
  }
});

TeachersRoute.get("/teacher-data",  async (req, res) => {
  try {
    const GetTeacher = await TeachersModel.findOne(req.body);
    res.send(GetTeacher);
  } catch (error) {
    res.status(400).send("teacher data not found");
  }
});

TeachersRoute.get("/teachers-data",  async (req, res) => {
  try {
    const GetTeacher = await TeachersModel.find();
    res.send(GetTeacher);
  } catch (error) {
    res.status(400).send("teachers data not found");
  }
});

TeachersRoute.post("/forgot-password", async (req, res) => {
  try {
      const { email, newPassword } = req.body;
      // Check if the user exists
      const userIdentify = await TeachersModel.findOne({ email });
      if (!userIdentify) {
          return res.status(404).json({ message: "User does not exist" });
      }
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      // Update the password
      await TeachersModel.updateOne({ email }, { $set: { password: hashedPassword } });
      res.json({ message: "Password updated successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error updating password", error });
  }
});


module.exports = TeachersRoute;
