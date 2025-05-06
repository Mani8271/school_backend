const express = require("express");
const StudentsRoute = express.Router();
const {isValidObjectId,validateEditStudentsData} = require("../../utils/validation");
const StudentsModel = require("../../models/Students");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
const path = require("path");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");

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

StudentsRoute.post("/add-students", userAuth, upload.single("ProfilePicture"), async (req, res) => {
  try {
    console.log("Uploaded File:", req.file);
    const hashPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashPassword;

    if (!req.file) {
      return res.status(400).json({
        errors: ["No file uploaded"],
        status: "unprocessable_entity"
      });
    }

    req.body.ProfilePicture = req.file.filename;

    const AddStudents = new StudentsModel(req.body);
    await AddStudents.save();

    res.send("Added Student Successfully");
  }catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in adding student";
  
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

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, firstName: user.firstName },
      "vamsi@1998",
      { expiresIn: "3h" } // Optional: Set token expiration
    );

    // Send token in response
    res.cookie("token", token, { httpOnly: true }); // Secure cookie
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "login failed";
  
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



StudentsRoute.patch("/update-student", userAuth, upload.single("ProfilePicture"), async (req, res) => {
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

    // Save updated student data
    await student.save();

    return res.json({
      message: "Student data updated successfully",
      student,
    });

  }catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in update student";
  
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

StudentsRoute.delete("/delete-student", userAuth, async (req, res) => {
  try {
    const studentId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(studentId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await StudentsModel.findByIdAndDelete(studentId);
    res.send("student deleted successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in delete student";
  
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

StudentsRoute.get("/search-student", userAuth, async (req, res) => {
  try {
    const GetStudentdata = await StudentsModel.findOne(req.body);
    res.send(GetStudentdata);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "student data not found";
  
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

StudentsRoute.get("/student-data", userAuth, async (req, res) => {
  try {
    const GetStudentdata = await StudentsModel.findOne(req.body);
    res.send(GetStudentdata);
  }catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "student data not found";
  
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

StudentsRoute.get("/students-data", userAuth, async (req, res) => {
  try {
    const GetStudentdata = await StudentsModel.find();
    res.send(GetStudentdata);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "students data not found";
  
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
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in forgot password";
  
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


StudentsRoute.get("/bulk-upload", userAuth, upload.single("file"), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json(errorResponse("No file uploaded"));
      }

      const filePath = req.file.path;
      const students = [];

      await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
              .pipe(csv())
              .on("data", (row) => {
                  if (Object.values(row).some(value => value && value.trim() !== "")) {
                      row._id = row._id?.trim() || null;
                      students.push(row);
                  }
              })
              .on("end", resolve)
              .on("error", reject);
      });

      if (students.length === 0) {
          return res.status(400).json(errorResponse("CSV file is empty or invalid"));
      }

      await Promise.all(
          students.map(async (student) => {
              if (student._id) {
                  await StudentsModel.findOneAndUpdate({ _id: student._id }, student, { upsert: true });
              } else {
                  await StudentsModel.create(student);
              }
          })
      );

      return res.status(200).json(successResponse("Students uploaded successfully"));
  }catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "An unexpected error occurred";
  
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
module.exports = StudentsRoute;
