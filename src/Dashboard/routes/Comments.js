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
    } catch (error) {
        res.status(400).send("error in add comments")
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
      } catch (error) {
        console.error("Error updating comment:", error);
        return res.status(500).json({ error: "Something went wrong" });
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
  } catch (error) {
    res.status(400).send("Error deleting  the comment");
  }
});

CommentsRoute.get("/search-comment", userAuth, async (req, res) => {
  try {
    const GetComment = await CommentsModel.findOne(req.body);
    res.send(GetComment);
  } catch (error) {
    res.status(400).send("comment data not found");
  }
});

CommentsRoute.get("/comment-data", userAuth, async (req, res) => {
  try {
    const GetCommentdata = await CommentsModel.findOne(req.body);
    res.send(GetCommentdata);
  } catch (error) {
    res.status(400).send("comment data not found");
  }
});

CommentsRoute.get("/comments-data", userAuth, async (req, res) => {
  try {
    const GetCommentdata = await CommentsModel.find();
    res.send(GetCommentdata);
  } catch (error) {
    res.status(400).send("comments data not found");
  }
});

CommentsRoute.get("/count-comments", userAuth, async (req, res) => {
    try {
        const commentCount = await CommentsModel.countDocuments();
        res.json({ count: commentCount });
    } catch (error) {
        res.status(400).json({ message: "Error fetching comment count", error });
    }
});

module.exports= CommentsRoute;
