const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
    
    className: {  // Renamed from "class"
        type: String, 
        required: true,
        unique:true
    }
}
,
{
  timestamps:true
});

module.exports = mongoose.model("Classes", ClassSchema);
