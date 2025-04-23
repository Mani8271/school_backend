const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
    
    className: {  // Renamed from "class"
        type: String, 
        
        unique:true
    },
    sectionName:
    {
        type:String,
        required:true,
    }
}
,
{
  timestamps:true
});

module.exports = mongoose.model("Sections", SectionSchema);
