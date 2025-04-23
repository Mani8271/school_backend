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
      const AddBusStaffRoute = new BusStaffModel(req.body);
      await AddBusStaffRoute.save();
      res.send("Added Bus staff Successfully");
    } catch (error) {
      res.status(400).send("Error adding the bus staff");
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
    if (req.files["profilePhoto"]) {
      const oldProfilePath = path.join(storagePath, busstaff.profilePhoto);
      if (fs.existsSync(oldProfilePath)) {
        fs.unlinkSync(oldProfilePath); // Delete old image
        console.log("✅ Old profile photo deleted:", busstaff.profilePhoto);
      }
      busstaff.profilePhoto = req.files["profilePhoto"][0].filename;
    }

    // ✅ Handle License Photo Update
    if (req.files["licensePhoto"]) {
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

  } catch (error) {
    console.error("Error updating bus staff:", error);
    return res.status(500).json({ error: "Something went wrong" });
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
  } catch (error) {
    res.status(400).send("Error deleting  the bus staff");
  }
});

BusStaffRoute.get("/search-bus-staff", userAuth, async (req, res) => {
  try {
    const GetBusStaffdata = await BusStaffModel.findOne(req.body);
    res.send(GetBusStaffdata);
  } catch (error) {
    res.status(400).send("bus staff not found");
  }
});

BusStaffRoute.get("/bus-staff-data", userAuth, async (req, res) => {
  try {
    const GetBusStaffdata = await BusStaffModel.findOne(req.body);
    res.send(GetBusStaffdata);
  } catch (error) {
    res.status(400).send("bus staff not found");
  }
});

BusStaffRoute.get("/buses-staff-data", userAuth, async (req, res) => {
  try {
    const GetBusStaffdata = await BusStaffModel.find();
    res.send(GetBusStaffdata);
  } catch (error) {
    res.status(400).send("bus staff not found");
  }
});


module.exports = BusStaffRoute;
