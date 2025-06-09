// const mongoose = require("mongoose");
// const CommentSchema = new mongoose.Schema({
//   name: {
//     type: String,
    
//   },
//   email: {
//     type: String,
    
//   },
//   comment: {
//     type: String,
    
//   },
// },
// {timestamps:true}
// );
// module.exports = mongoose.model("Comments", CommentSchema);
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment: String,
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog", // Reference to Blog model
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Comments", CommentSchema);
