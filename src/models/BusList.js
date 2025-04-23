const mongoose = require("mongoose");

const BusListSchema = new mongoose.Schema(
    {
        busNumber:
        {
            type:String,
            unique:true
        },
        busModel:
        {
            type:String,
            
        },
        capacity:
        {
            type:String,
            
        },
        status:
        {
            type:String,
            default:"Active",
            enum: ["Active", "Inactive"],
        }

    },
    {timestamps:true}
)

module.exports = mongoose.model("BusList",BusListSchema)