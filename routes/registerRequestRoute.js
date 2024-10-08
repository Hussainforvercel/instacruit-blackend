const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// Create a transport configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Or any other service you prefer
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Define the API endpoint to handle form submission
router.post("/send-email", async (req, res) => {
  const { companyName, email } = req.body;

  const mailOptions = {
    from: email, // Sender address
    to: process.env.RECEIVER_EMAIL, // The receiver's email address (e.g., your email)
    subject: "New Contact Form Submission",
    text: `Company Name: ${companyName}\nEmail: ${email}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error });
  }
});

module.exports = router;
