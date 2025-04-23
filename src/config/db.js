
// const mongoose = require("mongoose");

// const ConnectDB = async()=>
// {
//    await mongoose.connect("mongodb+srv://manikantaAyinam:Mani%409959@school.1pkp8r1.mongodb.net/?retryWrites=true&w=majority&appName=school")
// }
 
// module.exports = ConnectDB;
const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://manikantaAyinam:Mani%409959@school.1pkp8r1.mongodb.net/schoolDB?retryWrites=true&w=majority&appName=school");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

module.exports = ConnectDB;
