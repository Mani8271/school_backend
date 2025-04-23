const mongoose = require("mongoose");

const BusRouteSchema = new mongoose.Schema({
  route: {
    type: String,
   
  },
  busAssigned: {
    type: String,
  },
  driver: {
    type: String,
    
  },
  conductor: {
    type: String,
   
  },
  driverContact: {
    type: String,
    unique: true, 
  },
  conductorContact: {
    type: String,
    unique: true, 
  },
  busCapacity: {
    type: String,
  },
  students: {
    type: String,
   
  },
},
{
  timestamps:true
});

module.exports = mongoose.model("BusRoutes", BusRouteSchema);
