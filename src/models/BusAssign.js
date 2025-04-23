const mongoose = require("mongoose");

const BusAssignSchema = new mongoose.Schema({
    studentName: {
        type: String,
        
    },
    studentClass: {  // Renamed from "class"
        type: String, 
        
    },
    route: {  // Renamed from "Route"
        type: String,
        
    }
}
,
{
  timestamps:true
});

module.exports = mongoose.model("BusAssigns", BusAssignSchema);
