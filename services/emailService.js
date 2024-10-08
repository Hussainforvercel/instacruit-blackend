// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// exports.sendInvitationEmail = async (name, email, registrationLink) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "You are invited to join!",
//     text: `Hi ${name},\n\nYou have been invited to join. Please click on the link below to complete your registration:\n${registrationLink}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Invitation email sent successfully");
//   } catch (error) {
//     console.error("Error sending invitation email:", error);
//     throw new Error("Failed to send email");
//   }
// };

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send invitation email
const sendInvitationEmail = async (name, email, registrationLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You are invited to join!",
    text: `Hi ${name},\n\nYou have been invited to join. Please click on the link below to complete your registration:\n${registrationLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Invitation email sent successfully");
  } catch (error) {
    console.error("Error sending invitation email:", error);
    throw new Error("Failed to send email");
  }
};

const sendContactEmail = async (
  companyName,
  email,
  phoneNumber,
  message,
  subscribe
) => {
  try {
    // Nodemailer transport configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email options
    const mailOptions = {
      from: email,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Contact Form Submission",
      text: `
        Bedriftsnavn: ${companyName}
        E-post: ${email}
        Mobilnummer: ${phoneNumber}
        Melding: ${message}
        Subscribe: ${subscribe ? "Yes" : "No"}
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Email sending failed");
  }
};

// Export the function
module.exports = { sendInvitationEmail, sendContactEmail };
