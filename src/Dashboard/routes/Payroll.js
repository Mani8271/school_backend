const express = require("express");
const PayrollRoute = express.Router();
const { validateEditPayrollData,isValidObjectId} = require("../../utils/validation");
const PayrollModel = require("../../models/Payroll");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

PayrollRoute.post("/add-payroll", userAuth, async (req, res) => {
  try {
    const Addpayroll = new PayrollModel(req.body);
    await Addpayroll.save();
    res.send("Added payroll Successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error in adding payroll";
  
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

PayrollRoute.patch("/update-payroll-data", userAuth, async (req, res) => {
    try {
        
        const payrollId = req.body._id;
        // Ensure `_id` is a valid MongoDB ObjectId
        if (!isValidObjectId(payrollId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        // Find and update payroll by `_id`
        const updatedpayroll = await PayrollModel.findByIdAndUpdate(
            payrollId,  // Find by ID
            { $set: req.body },  // Update fields
            { new: true }  // Return updated document
        );
        if (!updatedpayroll) {
            return res.status(404).json({ error: "payroll not found" });
        }
        return res.json({ message: "payroll data updated successfully", payroll: updatedpayroll });
    }  catch (error) {
        console.error("❌ Error:", { message: error.message });
      
        let msg = "error in updating payroll";
      
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

PayrollRoute.delete("/delete-payroll-data",userAuth,async(req,res)=>
{
    try {
        const payrollId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(payrollId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }
      await PayrollModel.findByIdAndDelete(payrollId);
      res.send("payroll data deleted successfully");
    }  catch (error) {
        console.error("❌ Error:", { message: error.message });
      
        let msg = "error in deleting payroll";
      
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

PayrollRoute.get("/search-payroll-data",userAuth,async(req,res)=>
{
    try {
        const Getpayrolldata = await PayrollModel.findOne(req.body);
    res.send(Getpayrolldata);
    }  catch (error) {
        console.error("❌ Error:", { message: error.message });
      
        let msg = "payroll data not found";
      
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

PayrollRoute.get("/payroll-data",userAuth,async(req,res)=>
{
    try {
        const Getpayrolldata = await PayrollModel.findOne(req.body);
    res.send(Getpayrolldata);
    }  catch (error) {
        console.error("❌ Error:", { message: error.message });
      
        let msg = "payroll data not found";
      
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

PayrollRoute.get("/payrolls-data",userAuth,async(req,res)=>
    {
        try {
            const Getpayrolldata = await PayrollModel.find();
        res.send(Getpayrolldata);
        }  catch (error) {
            console.error("❌ Error:", { message: error.message });
          
            let msg = "payrolls data not found";
          
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

module.exports = PayrollRoute;
