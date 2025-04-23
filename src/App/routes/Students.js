const express = require("express");
const StudentsRoute = express.Router();
const {isValidObjectId,validateEditStudentsData} = require("../../utils/validation");
const StudentsModel = require("../../models/Students");
const { Error } = require("console");
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
const path = require("path");
const storagePath = path.join(__dirname, "../../../src/storage/studentimages");

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

StudentsRoute.post("/add-students", upload.single("ProfilePicture"), async (req, res) => {
  try {
      console.log("Uploaded File:", req.file); // Debugging

      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      req.body.ProfilePicture = req.file.filename;
      const hashPassword = await bcrypt.hash(req.body.password, 10);
          req.body.password = hashPassword;
      const AddStudents = new StudentsModel(req.body);
      await AddStudents.save();
      res.send("Added Student Successfully");
  } catch (error) {
      console.error("Error adding student:", error);
      res.status(400).send("Error adding the student");
  }
});

StudentsRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await StudentsModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
 // Secure cookie
    res.json({ message: "Login successful"});
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

StudentsRoute.post("/logout", async (req, res) => {
  res.send("logged out successfully");
});

StudentsRoute.patch("/update-student",  upload.single("ProfilePicture"), async (req, res) => {
  try {
    const studentId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(studentId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the student by ID
    let student = await StudentsModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // ✅ Handle Profile Picture Update
    if (req.file) {
      // Get old image path
      const oldImagePath = path.join(__dirname, "../../../src/storage/studentimages", student.ProfilePicture);

      // Delete old image if it exists
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("✅ Old image deleted:", student.ProfilePicture);
      }

      // Assign new image filename
      student.ProfilePicture = req.file.filename;
    }

    // ✅ Update other fields from request body
    Object.keys(req.body).forEach((key) => {
      student[key] = req.body[key];
    });
    if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          student.password = await bcrypt.hash(req.body.password, salt);
        } 

    // Save updated student data
    await student.save();

    return res.json({
      message: "Student data updated successfully",
      student,
    });

  } catch (error) {
    console.error("Error updating student:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

StudentsRoute.delete("/delete-student",  async (req, res) => {
  try {
    const studentId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(studentId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await StudentsModel.findByIdAndDelete(studentId);
    res.send("student deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the bus student");
  }
});

StudentsRoute.get("/profile", async (req, res) => {
  try {
    const { _id } = req.query;
    const user = await StudentsModel.findOne({ _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile data", error });
  }
});

StudentsRoute.get("/search-student",  async (req, res) => {
  try {
    const GetStudentdata = await StudentsModel.findOne(req.body);
    res.send(GetStudentdata);
  } catch (error) {
    res.status(400).send("student not found");
  }
});

StudentsRoute.get("/student-data",  async (req, res) => {
  try {
    const GetStudentdata = await StudentsModel.findOne(req.body);
    res.send(GetStudentdata);
  } catch (error) {
    res.status(400).send("bus staff not found");
  }
});

StudentsRoute.get("/students-data",  async (req, res) => {
  try {
    const GetStudentdata = await StudentsModel.find();
    res.send(GetStudentdata);
  } catch (error) {
    res.status(400).send("student not found");
  }
});

StudentsRoute.post("/forgot-password", async (req, res) => {
  try {
      const { email, newPassword } = req.body;
      // Check if the user exists
      const userIdentify = await StudentsModel.findOne({ email });
      if (!userIdentify) {
          return res.status(404).json({ message: "User does not exist" });
      }
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      // Update the password
      await StudentsModel.updateOne({ email }, { $set: { password: hashedPassword } });
      res.json({ message: "Password updated successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error updating password", error });
  }
});

StudentsRoute.get("/get-logged-in-user-details", async (req, res) => {
  try {
    const { _id } = req.query;
    const user = await StudentsModel.findOne({ _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = StudentsRoute;
