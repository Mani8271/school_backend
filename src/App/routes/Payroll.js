const express = require("express");
const PayrollRoute = express.Router();
const { validateEditPayrollData,isValidObjectId} = require("../../utils/validation");
const PayrollModel = require("../../models/Payroll");
const { Error } = require("console");
const { AppuserAuth } = require("../../middlewares/auth");

PayrollRoute.post("/add-payroll",  async (req, res) => {
  try {
    const Addpayroll = new PayrollModel(req.body);
    await Addpayroll.save();
    res.send("Added payroll Successfully");
  } catch (error) {
    res.status(400).send("Error adding the payroll");
  }
});

PayrollRoute.patch("/update-payroll-data",  async (req, res) => {
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
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

PayrollRoute.delete("/delete-payroll-data",async(req,res)=>
{
    try {
        const payrollId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(payrollId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }
      await PayrollModel.findByIdAndDelete(payrollId);
      res.send("payroll data deleted successfully");
    } catch (error) {
        res.status(400).send("Error deleting  the payroll data");
      }
})

PayrollRoute.get("/search-payroll-data",async(req,res)=>
{
    try {
        const Getpayrolldata = await PayrollModel.findOne(req.body);
    res.send(Getpayrolldata);
    } catch (error) {
        res.status(400).send("payroll data not found");
    }
})

PayrollRoute.get("/payroll-data",async(req,res)=>
{
    try {
        const Getpayrolldata = await PayrollModel.findOne(req.body);
    res.send(Getpayrolldata);
    } catch (error) {
        res.status(400).send("payroll data not found");
    }
})

PayrollRoute.get("/payrolls-data",async(req,res)=>
    {
        try {
            const Getpayrolldata = await PayrollModel.find();
        res.send(Getpayrolldata);
        } catch (error) {
            res.status(400).send("payroll data not found");
        }
    })

module.exports = PayrollRoute;
