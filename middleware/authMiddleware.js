// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// const Blacklist = require("../models/Blacklist"); // Import blacklist model
// dotenv.config();

// const protect = async (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     const jwtToken = token.split(" ")[1];

//     // Check if token is blacklisted
//     const blacklistedToken = await Blacklist.findOne({ token: jwtToken });
//     if (blacklistedToken) {
//       return res
//         .status(401)
//         .json({ message: "You've logged out. Please log in again." });
//     }

//     // Verify token and set req.user
//     const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// module.exports = { protect };

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Blacklist = require("../models/Blacklist"); // Import blacklist model
dotenv.config();

const protect = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("Authorization Header:", authHeader); // Log the Authorization header

  // Check if Authorization header exists and is properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Authorization token missing or malformed.");
    return res
      .status(401)
      .json({ message: "Authorization token missing or malformed." });
  }

  try {
    const jwtToken = authHeader.split(" ")[1];
    console.log("JWT Token:", jwtToken); // Log the extracted JWT token

    // Check if the token is blacklisted (e.g., after logging out)
    const blacklistedToken = await Blacklist.findOne({ token: jwtToken });
    if (blacklistedToken) {
      console.log("Token is blacklisted. User has logged out.");
      return res
        .status(401)
        .json({ message: "You've logged out. Please log in again." });
    }

    // Verify the token and set req.user to the decoded user information
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Log the decoded JWT

    req.user = decoded; // Attach the decoded user info to the request object
    console.log("User authenticated successfully with ID:", decoded.id); // Log the user ID after successful authentication

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle token verification errors (expired, invalid)
    console.error("JWT Error:", error); // Log any JWT errors for debugging

    if (error.name === "TokenExpiredError") {
      console.log("Token has expired.");
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      console.log("Invalid token.");
      return res
        .status(401)
        .json({ message: "Invalid token. Authorization denied." });
    }

    // Handle any unexpected errors
    console.log("Internal server error during authorization.");
    return res
      .status(500)
      .json({ message: "Internal server error during authorization." });
  }
};

module.exports = { protect };
