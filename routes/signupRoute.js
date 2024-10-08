const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/userRegisterModel"); // Assuming you have a User model set up
const router = express.Router();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services too like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Route to register a new user and send notification email
router.post("/register-user", async (req, res) => {
  const { companyName, email, password } = req.body;

  // Simple validation
  if (!companyName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      companyName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Send registration notification email to the user
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email address
      to: email, // User's email address
      subject: "Your Account Has Been Created",
      text: `Hello ${companyName},\n\nYour account has been successfully created. You can now sign in using the credentials you provided.\n\nBest regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);

    // Respond to the client (admin) with success
    res
      .status(201)
      .json({ message: "User created successfully and email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
