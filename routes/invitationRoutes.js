const express = require("express");
const router = express.Router();
const {
  sendInvitation,
  registerUser,
} = require("../controllers/invitationController");

// POST request to send an invitation
router.post("/invite", sendInvitation);

// POST request to register user via token
router.post("/register", registerUser);

module.exports = router;
