const jwt = require("jsonwebtoken");
const systemUserModel = require("../models/systemUsers");

const userAuth = async (req, res, next) => {
  try {
    // const { token } = req.cookies;
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    console.log(token);

    if (!token) {
      throw new Error("Invalid token");
    }

    // Verify the token and extract user ID
    const verifyToken = await jwt.verify(token, "vamsi@1998", {
      expiresIn: "2h",
    });
    const { _id } = verifyToken;

    // Find the user by ID
    const user = await systemUserModel.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    if (!user.role === "Admin" || !user.role === "Super Admin") {
      throw new Error("Invalid user");
    }
    // Attach user to request object
    req.user = user;
    next(); // Pass control to the next middleware
  } catch (error) {
    // Send the error message in response
    res.status(400).json({ error: error.message });
  }
};

module.exports = { userAuth };
