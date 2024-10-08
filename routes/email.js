const express = require("express");
const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { to, subject, body } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error });
  }
});

module.exports = router; // Make sure you're exporting the router
