const express = require("express");
const BusStaffRoute = express.Router();
const {isValidObjectId,validateEditBusRouteData, validateEditBusStaffData} = require("../../utils/validation");
const BusStaffModel = require("../../models/BusStaff");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const storagePath = path.join(__dirname, "../../../src/storage/busstaffimages");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");


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


BusStaffRoute.post("/add-bus-staff",userAuth,upload.fields([{ name: "profilePhoto" }, { name: "licensePhoto" }]),async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashPassword;
      if (req.files?.profilePhoto?.length > 0) {
        req.body.profilePhoto = req.files.profilePhoto[0].filename;
      }

      if (req.files?.licensePhoto?.length > 0) {
        req.body.licensePhoto = req.files.licensePhoto[0].filename;
      }
    const AddBusStaffRoute = new BusStaffModel(req.body);
    await AddBusStaffRoute.save();
    res.send("Added Bus staff Successfully");
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in creating bus staff";
  
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


BusStaffRoute.patch("/update-bus-staff", userAuth, upload.fields([{ name: "profilePhoto" }, { name: "licensePhoto" }]), async (req, res) => {
  try {
    const busstaffId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(busstaffId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the bus staff by ID
    let busstaff = await BusStaffModel.findById(busstaffId);
    if (!busstaff) {
      return res.status(404).json({ error: "Bus staff not found" });
    }

    // ✅ Handle Profile Photo Update
    if (req.files?.profilePhoto) {
      const oldProfilePath = path.join(storagePath, busstaff.profilePhoto);
      if (fs.existsSync(oldProfilePath)) {
        fs.unlinkSync(oldProfilePath); // Delete old image
        console.log("✅ Old profile photo deleted:", busstaff.profilePhoto);
      }
      busstaff.profilePhoto = req.files["profilePhoto"][0].filename;
    }

    // ✅ Handle License Photo Update
    if (req.files?.licensePhoto) {
      const oldLicensePath = path.join(storagePath, busstaff.licensePhoto);
      if (fs.existsSync(oldLicensePath)) {
        fs.unlinkSync(oldLicensePath); // Delete old image
        console.log("✅ Old license photo deleted:", busstaff.licensePhoto);
      }
      busstaff.licensePhoto = req.files["licensePhoto"][0].filename;
    }

    // ✅ Update other fields from request body
    Object.keys(req.body).forEach((key) => {
      if (key !== "_id") {
        busstaff[key] = req.body[key];
      }
    });

    // Save updated bus staff data
    await busstaff.save();

    return res.json({
      message: "Bus staff data updated successfully",
      busstaff,
    });

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in updating bus staff";
  
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

BusStaffRoute.delete("/delete-bus-staff", userAuth, async (req, res) => {
  try {
    const busstaffId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(busstaffId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await BusStaffModel.findByIdAndDelete(busstaffId);
    res.send("bus staff deleted successfully");
  }   catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in deleting bus staff";
  
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

BusStaffRoute.get("/search-bus-staff", userAuth, async (req, res) => {
  try {
    const GetBusStaffdata = await BusStaffModel.findOne(req.body);
    res.send(GetBusStaffdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "bus staff data not found";
  
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

BusStaffRoute.get("/bus-staff-data", userAuth, async (req, res) => {
  try {
    const GetBusStaffdata = await BusStaffModel.findOne(req.body);
    res.send(GetBusStaffdata);
  }   catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "buses route not found";
  
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

BusStaffRoute.get("/buses-staff-data", userAuth, async (req, res) => {
  try {
    const GetBusStaffdata = await BusStaffModel.find();
    res.send(GetBusStaffdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "buses staff data not found";
  
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


module.exports = BusStaffRoute;
