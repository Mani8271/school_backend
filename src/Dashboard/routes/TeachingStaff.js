const express = require("express");
const TeachersRoute = express.Router();
const {isValidObjectId,validateEditTeachersData,} = require("../../utils/validation");
const TeachersModel = require("../../models/TeachingStaff");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
const path = require("path");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");


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

TeachersRoute.post("/add-teacher", userAuth,upload.single("ProfilePicture"), async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashPassword;
    const AddClassTimeTable = new TeachersModel(req.body);
    await AddClassTimeTable.save();
    res.send("Added teacher Successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in adding teacher";
  
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



TeachersRoute.patch("/update-teacher", userAuth, upload.single("ProfilePicture"), async (req, res) => {
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
    teacher.password = await bcrypt.hash(req.body.password, salt);
    } 
    // Save updated teacher data
    await teacher.save();

    return res.json({
      message: "Teacher updated successfully",
      teacher,
    });

  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in update teacher data";
  
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

TeachersRoute.delete("/delete-teacher", userAuth, async (req, res) => {
  try {
    const teacherId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(teacherId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await TeachersModel.findByIdAndDelete(teacherId);
    res.send("teacher deleted successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in delete teacher data";
  
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

TeachersRoute.get("/search-teacher", userAuth, async (req, res) => {
  try {
    const GetTeacher = await TeachersModel.findOne(req.body);
    res.send(GetTeacher);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "teacher data not found";
  
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

TeachersRoute.get("/teacher-data", userAuth, async (req, res) => {
  try {
    const GetTeacher = await TeachersModel.findOne(req.body);
    res.send(GetTeacher);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "teacher data not found";
  
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

TeachersRoute.get("/teachers-data", userAuth, async (req, res) => {
  try {
    const GetTeacher = await TeachersModel.find();
    res.send(GetTeacher);
  }catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "teachers data not found";
  
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

TeachersRoute.post( "/bulk-upload", userAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json(errorResponse("No file uploaded"));
      }
      const filePath = req.file.path;
      const teachers = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => {
            if (
              Object.values(row).some((value) => value && value.trim() !== "")
            ) {
              row._id = row._id?.trim() || null;
              teachers.push(row);
            }
          })
          .on("end", resolve)
          .on("error", reject);
      });

      if (teachers.length === 0) {
        return res
          .status(400)
          .json(errorResponse("CSV file is empty or invalid"));
      }

      await Promise.all(
        teachers.map(async (teacher) => {
          if (teacher._id) {
            await TeachersModel.findOneAndUpdate(
              { _id: teacher._id },
              teacher,
              { upsert: true }
            );
          } else {
            await TeachersModel.create(teacher);
          }
        })
      );
      return res
        .status(200)
        .json(successResponse("Teaching staff uploaded successfully"));
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
  }
);

module.exports = TeachersRoute;
