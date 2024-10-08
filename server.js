const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
// const candidateRoutes = require("./routes/candidateRoutes");
const FormData = require("./routes/orespørselsinformasjonsfeltRoute");
const candidateRouter = require("./routes/candidateRoutes"); // Rename this from emailRouter to candidateRouter
const emailRouter = require("./routes/email"); // Keep this for email routes
const emailServiceRoutes = require("./services/emailService");
const contactRoutes = require("./routes/contactRoutes");
const registrationRequestRoute = require("./routes/registerRequestRoute");
const invitationRoute = require("./routes/invitationRoutes");
dotenv.config();

const app = express();
app.use(cors());

connectDB();

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
// app.use("/api/candidates", candidateRouter); // Use renamed candidateRouter
app.use("/api/invitations", invitationRoutes);
app.use("/api/form", FormData);
// app.use("/api/email", candidateRouter); // Keep emailRouter for email routes
app.use("/api/candidates", candidateRouter); // This ensures the send-email route is under /api/candidates
// Use routes
app.use("/api/contact", contactRoutes);

// Use the email routes at /api/send-email
app.use("/api", registrationRequestRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("CLIENT_URL from .env:", process.env.CLIENT_URL);
});

export default app;
