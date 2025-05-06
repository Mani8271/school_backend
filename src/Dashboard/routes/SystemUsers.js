const express = require("express");
const systemUserRoute = express.Router();
const {
  validateSystemUserData
} = require("../../utils/validation");
const bcrypt = require("bcrypt");
const systemUsersModel = require("../../models/systemUsers");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { json } = require("body-parser");
const fs = require("fs");
const { error } = require("console");
const { userAuth } = require("../../middlewares/auth");


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


systemUserRoute.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword;

    if (req.file) {
      req.body.profilePicture = `${req.file.filename}`;
    } else {
      console.log("No file uploaded");
    }

    const user = new systemUsersModel(req.body);
    await user.save();

    res.json({ message: "User added successfully", user });
  }
  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in adding user";
  
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


systemUserRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await systemUsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Role check
    if (user.role !== "Admin" && user.role !== "Super Admin") {
      return res.status(403).json({ message: "Invalid user role" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, firstName: user.firstName },
      "vamsi@1998"
    );

    res.cookie("token", token, { httpOnly: true }); // Secure cookie
    res.json({ message: "Login successful", token ,  user: { 
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      role: user.role,  // Add additional fields as needed
      profilePicture: user.profilePicture
    } });
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "unable to login";
  
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

systemUserRoute.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  }catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "failed to get user data";
  
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

systemUserRoute.get("/all-profiles", userAuth, async (req, res) => {
  try {
    const users = await systemUsersModel.find();
    if (!users) {
      throw new error("user does not exist");
    }
    res.send(users);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "failed to get all users data";
  
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

systemUserRoute.patch("/user-update", userAuth, upload.single("profilePicture"), async (req, res) => {
  try {
    const loggedinUser = req.user;
    if (!loggedinUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Handle Profile Picture Update
    if (req.file) {
      const oldImagePath = path.join(__dirname, "../../../src/storage/userimages", loggedinUser.profilePicture);

      // Delete old image if it exists
      if (loggedinUser.profilePicture && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("✅ Old image deleted:", loggedinUser.profilePicture);
      }

      // Assign new image filename
      loggedinUser.profilePicture = req.file.filename;
    }

    // ✅ Update other fields from request body
    Object.keys(req.body).forEach((key) => {
      loggedinUser[key] = req.body[key];
    });

    // Save updated user data
    await loggedinUser.save();

    res.json({
      message: `${loggedinUser.firstName}, your profile updated successfully`,
      data: loggedinUser,
    });

  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "failed to update user";
  
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

systemUserRoute.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logged out successfully");
});

systemUserRoute.get("/search",userAuth,async(req,res)=>
{
  try {
    const findUser = await systemUsersModel.findOne(req.body);
  res.send(findUser)
} catch (error) {
  console.error("❌ Error:", { message: error.message });

  let msg = "user data not found";

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
})

systemUserRoute.post("/forgot-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        // Check if the user exists
        const userIdentify = await systemUsersModel.findOne({ email });
        if (!userIdentify) {
            return res.status(404).json({ message: "User does not exist" });
        }
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Update the password
        await systemUsersModel.updateOne({ email }, { $set: { password: hashedPassword } });
        res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "password not changed";
    
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

systemUserRoute.post("/reset-password", userAuth, async (req, res) => {
    try {
        const user = req.user; // User from authentication middleware
        const { password, newPassword } = req.body;

        // Compare old password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        await systemUsersModel.updateOne({ email: user.email }, { $set: { password: hashedPassword } });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "failed to reset password";
    
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

systemUserRoute.get("/get-logged-in-user-details", userAuth, async (req, res) => {
  try {
    // Extract user details from request
    const user = req.user; 
    
    // If no user found (edge case)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user details
    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error getting logged in details";
  
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


module.exports = systemUserRoute;
