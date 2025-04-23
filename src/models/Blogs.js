const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  blogName: {
    type: String,
    required: [true, "Blog name is required"],
    minlength: [6, "Blog name must be at least 6 characters long"],
    maxlength: [16, "Blog name must not exceed 16 characters"],
    unique:true,
    trim: true,
  },
  blogImage: {
    type: String,
    required: [true, "Blog image is required"],
  },
  blogCategory: {
    type: String,
    required: [true, "Blog category is required"],
    minlength: [6, "Blog category must be at least 6 characters long"],
    maxlength: [14, "Blog category must not exceed 14 characters"],
    trim: true,
  },
  blogDescription: {
    type: String,
    required: [true, "Blog description is required"],
    minlength: [10, "Blog description must be at least 10 characters long"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps:true
});

module.exports = mongoose.model("Blog", BlogSchema);
