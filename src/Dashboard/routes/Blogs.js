const express = require("express");
const BlogsRoute = express.Router();
const {isValidObjectId,validateEditBlogData} = require("../../utils/validation");
const BlogsModel = require("../../models/Blogs");
const { Error } = require("console");
const { userAuth } = require("../../middlewares/auth");
const multer = require("multer");
const path = require("path")
const fs = require("fs")
const storagePath = path.join(__dirname, "../../../src/storage/blogimages");

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

BlogsRoute.post("/add-blog",upload.single("blogImage"),userAuth,async (req, res) => {
    try {
        if (req.file) {
            // Store the relative file path in the database
            req.body.blogImage = `${req.file.filename}`;
          } else {
            console.log("No file uploaded");
          }
      const AddBlog = new BlogsModel(req.body);
      await AddBlog.save();
      res.send("Added Blog Successfully");
    }  catch (error) {
      console.error("❌ Error:", { message: error.message });
    
      let msg = "error adding blog";
    
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

BlogsRoute.patch("/update-blog-data", upload.single("blogImage"), userAuth, async (req, res) => {
  try {
    const blogId = req.body._id;

    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(blogId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the blog by ID first
    let blog = await BlogsModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // ✅ Update blog image if uploaded
    if (req.file) {
      // Get old image path
      const oldImagePath = path.join(storagePath, blog.blogImage);

      // Delete old image if it exists
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("✅ Old image deleted:", blog.blogImage);
      }

      // Assign new image filename
      blog.blogImage = req.file.filename;
    }

    // ✅ Update other fields from request body
    Object.keys(req.body).forEach((key) => {
      if (key !== "blogImage") blog[key] = req.body[key];
    });

    // Save updated blog
    await blog.save();

    return res.json({
      message: "Blog data updated successfully",
      blog,
    });

  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error updating blog";
  
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

BlogsRoute.delete("/delete-blog-data", userAuth, async (req, res) => {
  try {
    const blogId = req.body._id;
    // Ensure `_id` is a valid MongoDB ObjectId
    if (!isValidObjectId(blogId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await BlogsModel.findByIdAndDelete(blogId);
    res.send("blog data deleted successfully");
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "error deleting blog";
  
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

BlogsRoute.get("/search-blog-data", userAuth, async (req, res) => {
  try {
    const GetBlogdata = await BlogsModel.findOne(req.body);
    res.send(GetBlogdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "blog data not found";
  
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

BlogsRoute.get("/blog", userAuth, async (req, res) => {
  try {
    const GetBlogdata = await BlogsModel.findOne(req.body);
    res.send(GetBlogdata);
  } catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "blog data not found";
  
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

BlogsRoute.get("/blogs", userAuth, async (req, res) => {
  try {
    const GetBlogdata = await BlogsModel.find();
    res.send(GetBlogdata);
  }  catch (error) {
    console.error("❌ Error:", { message: error.message });
  
    let msg = "blogs data not found";
  
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

module.exports = BlogsRoute;
