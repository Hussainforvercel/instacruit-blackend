// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// const Blacklist = require("../models/Blacklist");
// const { protect } = require("../middleware/authMiddleware");
// dotenv.config();

// // Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // User Signup Route
// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if the user already exists
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Create a new user
//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     // Send a welcome email to the user
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email, // The user's email
//       subject: "Welcome to Our instacruit!",
//       text: `Hello ${name},\n\nYour account has been successfully created.\n\nHere are your credentials:\nEmail: ${email}\nPassword: ${password}\n\nYou can now log in with your credentials.\n\nBest regards,\nYour Team`,
//     };

//     await transporter.sendMail(mailOptions);

//     // Return response with JWT token
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id), // Generate token for the new user
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//       // If login successful, send user data and token
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Dashboard Route (user-specific dashboard data)
// router.get("/dashboard", protect, async (req, res) => {
//   try {
//     // req.user contains the user info from the protect middleware
//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Fetch or create user-specific data here (for example, their dashboard data)
//     // Assuming each user has a personalized dashboard based on their information:
//     const userDashboardData = {
//       name: user.name,
//       email: user.email,
//       createdAt: user.createdAt,
//       // Any other user-specific dashboard information
//     };

//     // Return the dashboard data specific to this user
//     res.status(200).json({ dashboardData: userDashboardData });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Logout Route
// router.post("/logout", protect, async (req, res) => {
//   try {
//     const token = req.header("Authorization").split(" ")[1];

//     // Add the token to the blacklist to prevent further use
//     await Blacklist.create({ token });

//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging out" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Invitation = require("../models/invitationModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Blacklist = require("../models/Blacklist");
const { protect } = require("../middleware/authMiddleware");
dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// User Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Send a welcome email to the user
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // The user's email
      subject: "Welcome to Our instacruit!",
      text: `Hello ${name},\n\nYour account has been successfully created.\n\nYou can now log in with your credentials.\n\nBest regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);

    // Return response with JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // Generate token for the new user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Invitation-based Registration Route
// router.post("/register-invitation", async (req, res) => {
//   const { token, password, confirmPassword } = req.body;

//   try {
//     // Ensure password and confirmPassword match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: "Passwords do not match" });
//     }

//     // Find the invitation by token
//     const invitation = await Invitation.findOne({ token });
//     if (!invitation || invitation.expiresAt < Date.now()) {
//       return res.status(400).json({ error: "Invalid or expired token" });
//     }

//     // Retrieve name and email from the invitation
//     const { name, email } = invitation;

//     // Check if user is already registered
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // Delete the invitation after successful registration
//     await Invitation.deleteOne({ token });

//     // Send a welcome email to the user
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Welcome to Our instacruit!",
//       text: `Hello ${name},\n\nYour account has been successfully activated. You can now log in with your credentials.\n\nBest regards,\nYour Team`,
//     };

//     await transporter.sendMail(mailOptions);

//     // Return response with JWT token
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id), // Generate token for the new user
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.post("/register-invitation", async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  try {
    // Ensure password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Find the invitation by token
    const invitation = await Invitation.findOne({ token });

    // Check if invitation exists or is expired
    if (!invitation) {
      return res
        .status(400)
        .json({ error: "Invalid token or invitation not found" });
    }

    if (invitation.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Invitation expired" });
    }

    // Retrieve name and email from the invitation
    const { name, email } = invitation;

    // Check if user is already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Delete the invitation after successful registration
    await Invitation.deleteOne({ token });

    // Send a welcome email to the user
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our instacruit!",
      text: `Hello ${name},\n\nYour account has been successfully activated. You can now log in with your credentials.\n\nBest regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);

    // Return response with JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // Generate token for the new user
      message: "User activated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // If login successful, send user data and token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard Route (user-specific dashboard data)
router.get("/dashboard", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDashboardData = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.status(200).json({ dashboardData: userDashboardData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout Route
router.post("/logout", protect, async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];

    // Add the token to the blacklist to prevent further use
    await Blacklist.create({ token });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
});

module.exports = router;
