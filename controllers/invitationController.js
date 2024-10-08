const dotenv = require("dotenv");
const crypto = require("crypto");
const Invitation = require("../models/invitationModel");
// const User = require("../models/user");
const User = require("../models/user");
const emailService = require("../services/emailService");
const generateToken = require("../utils/generateTokens");
dotenv.config();
exports.sendInvitation = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    // Check if an active invitation already exists for this email
    const existingInvitation = await Invitation.findOne({ email });
    if (existingInvitation && existingInvitation.expiresAt > Date.now()) {
      return res.status(400).json({ error: "Invitation already sent" });
    }

    // Generate a unique token and create an expiration date
    const token = generateToken();
    const expiresAt = Date.now() + 3600000 * 24; // 24 hours expiration

    // Save invitation to the database
    const invitation = new Invitation({ name, email, token, expiresAt });
    await invitation.save();

    // Send invitation email
    // const registrationLink = `${process.env.CLIENT_URL}/register?token=${token}`;/
    const registrationLink = `${process.env.CLIENT_URL}/invitation/${token}`;

    await emailService.sendInvitationEmail(name, email, registrationLink);

    res.status(200).json({ message: "Invitation sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send the invitation" });
  }
};

// exports.registerUser = async (req, res) => {
//   const { token, name, email, password } = req.body;

//   try {
//     // Find the invitation by token
//     const invitation = await Invitation.findOne({ token });
//     if (!invitation || invitation.expiresAt < Date.now()) {
//       return res.status(400).json({ error: "Invalid or expired token" });
//     }

//     // Check if user is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already registered" });
//     }

//     // Hash password before saving
//     const hashedPassword = await User.hashPassword(password);

//     // Register the new user
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     // Delete the invitation after successful registration
//     await invitation.remove();

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Registration failed" });
//   }
// };

exports.registerUser = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  console.log("Received token:", token); // Log token for debugging
  console.log("Received password:", password); // Log password for debugging
  console.log("Received confirmPassword:", confirmPassword); // Log confirmPassword for debugging

  try {
    // Ensure password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Find the invitation by token
    const invitation = await Invitation.findOne({ token });
    if (!invitation || invitation.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Retrieve name and email from the invitation
    const { name, email } = invitation;

    // Check if user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    // Create a new user with the name and email from the invitation, and the hashed password
    const newUser = new User({ name, email, password }); // Password will be hashed in the User model

    await newUser.save();

    // Delete the invitation after successful registration using deleteOne
    await Invitation.deleteOne({ token });

    // Return success response with user-specific data (e.g., userId)
    res.status(201).json({
      message: "User registered successfully!",
      userId: newUser._id, // Return the user's ID to redirect to the dashboard
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};
