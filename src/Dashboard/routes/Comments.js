const express = require("express");
const CommentsRoute = express.Router();
const {isValidObjectId,validateEditBlogData} = require("../../utils/validation");
const CommentsModel = require("../../models/Comments");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");

CommentsRoute.post("/add-comment",userAuth,async(req,res)=>
{
    try {
    const Comments = await CommentsModel(req.body);
    res.send("comment added successfully");
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error in adding comments";
    
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

CommentsRoute.patch("/update-comment",userAuth,async(req,res)=>
{
     try {
        
        const commentId = req.body._id;
        if (!isValidObjectId(commentId)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }
        let comment = await CommentsModel.findById(commentId);
        if (!comment) {
          return res.status(404).json({ error: "comment not found" });
        }
        await comment.save();
        return res.json({
          message: "comment data updated successfully",
          comment,
        });
      }  catch (error) {
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
})

CommentsRoute.delete("/delete-comment", userAuth, async (req, res) => {
  try {
    const commentId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(commentId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await CommentsModel.findByIdAndDelete(commentId);
    res.send("comment deleted successfully");
  }  catch (error) {
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

CommentsRoute.get("/search-comment", userAuth, async (req, res) => {
  try {
    const GetComment = await CommentsModel.findOne(req.body);
    res.send(GetComment);
  }  catch (error) {
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

CommentsRoute.get("/comment-data", userAuth, async (req, res) => {
  try {
    const GetCommentdata = await CommentsModel.findOne(req.body);
    res.send(GetCommentdata);
  }  catch (error) {
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

CommentsRoute.get("/comments-data", userAuth, async (req, res) => {
  try {
    const GetCommentdata = await CommentsModel.find();
    res.send(GetCommentdata);
  }  catch (error) {
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

CommentsRoute.get("/count-comments", userAuth, async (req, res) => {
    try {
        const commentCount = await CommentsModel.countDocuments();
        res.json({ count: commentCount });
    }  catch (error) {
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

module.exports= CommentsRoute;
