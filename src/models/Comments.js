const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  email: {
    type: String,
    
  },
  comment: {
    type: String,
    
  },
},
{timestamps:true}
);
module.exports = mongoose.model("Comments", CommentSchema);
