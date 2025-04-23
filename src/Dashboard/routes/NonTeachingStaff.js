const express = require("express");
const NonTeachingStaffRoute = express.Router();
const {isValidObjectId, validateEditTeachersData, validateEditNonTeachersData} = require("../../utils/validation");
const NonTeachingStaffModel = require("../../models/TeachingStaff");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
const path = require("path");


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

NonTeachingStaffRoute.post("/add-staff",userAuth,upload.single("ProfilePicture"),async (req, res) => {
    try {
      if (req.file) {
        // Store the relative file path in the database
        req.body.ProfilePicture = `${req.file.filename}`;
      } else {
        console.log("No file uploaded");
      }
      const AddStaff = new NonTeachingStaffModel(req.body);
      await AddStaff.save();
      res.send("Added teacher Successfully");
    } catch (error) {
      res.status(400).send("Error adding the staff");
    }
  }
);

NonTeachingStaffRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await NonTeachingStaffModel.findOne({ email });
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
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


NonTeachingStaffRoute.patch("/update-staff", userAuth, upload.single("ProfilePicture"), async (req, res) => {
  try {
    const staffId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(staffId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the staff by ID
    let staff = await NonTeachingStaffModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    // ✅ Handle Profile Picture Update
    if (req.file) {
      // Get old image path
      const oldImagePath = path.join(__dirname, "../../../src/storage/staffimages", staff.ProfilePicture);

      // Delete old image if it exists
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("✅ Old image deleted:", staff.ProfilePicture);
      }

      // Assign new image filename
      staff.ProfilePicture = req.file.filename;
    }

    // ✅ Update other fields from request body
    Object.keys(req.body).forEach((key) => {
      staff[key] = req.body[key];
    });

    // Save updated staff data
    await staff.save();

    return res.json({
      message: "Staff updated successfully",
      staff,
    });

  } catch (error) {
    console.error("Error updating staff:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

NonTeachingStaffRoute.delete("/delete-staff", userAuth, async (req, res) => {
  try {
    const staffId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(staffId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await TeachersModel.findByIdAndDelete(staffId);
    res.send("staff deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the staff");
  }
});

NonTeachingStaffRoute.get("/search-staff", userAuth, async (req, res) => {
  try {
    const GetStaff = await NonTeachingStaffModel.findOne(req.body);
    res.send(GetStaff);
  } catch (error) {
    res.status(400).send("staff not found");
  }
});

NonTeachingStaffRoute.get("/staff-data", userAuth, async (req, res) => {
  try {
    const GetStaff = await NonTeachingStaffModel.findOne(req.body);
    res.send(GetStaff);
  } catch (error) {
    res.status(400).send("staff data not found");
  }
});

NonTeachingStaffRoute.get("/all-staff-data", userAuth, async (req, res) => {
  try {
    const GetStaff = await NonTeachingStaffModel.find();
    res.send(GetStaff);
  } catch (error) {
    res.status(400).send("teachers data not found");
  }
});

NonTeachingStaffRoute.post("/forgot-password", async (req, res) => {
  try {
      const { email, newPassword } = req.body;
      // Check if the user exists
      const userIdentify = await NonTeachingStaffModel.findOne({ email });
      if (!userIdentify) {
          return res.status(404).json({ message: "User does not exist" });
      }
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      // Update the password
      await NonTeachingStaffModel.updateOne({ email }, { $set: { password: hashedPassword } });
      res.json({ message: "Password updated successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error updating password", error });
  }
});

NonTeachingStaffRoute.post("/bulk-upload", userAuth, upload.single("file"), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json(errorResponse("No file uploaded"));
      }

      const filePath = req.file.path;
      const staffData = [];

      await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
              .pipe(csv())
              .on("data", (row) => {
                  if (Object.values(row).some(value => value && value.trim() !== "")) {
                      row._id = row._id?.trim() || null;
                      staffData.push(row);
                  }
              })
              .on("end", resolve)
              .on("error", reject);
      });

      if (staffData.length === 0) {
          return res.status(400).json(errorResponse("CSV file is empty or invalid"));
      }

      await Promise.all(
          staffData.map(async (staff) => {
              if (staff._id) {
                  await NonTeachingStaffModel.findOneAndUpdate({ _id: staff._id }, staff, { upsert: true });
              } else {
                  await NonTeachingStaffModel.create(staff);
              }
          })
      );

      return res.status(200).json(successResponse("Non-teaching staff uploaded successfully"));
  } catch (error) {
      console.error("Error in bulk upload:", error);
      return res.status(500).json(errorResponse("Error processing non-teaching staff upload"));
  }
});

module.exports = NonTeachingStaffRoute;
