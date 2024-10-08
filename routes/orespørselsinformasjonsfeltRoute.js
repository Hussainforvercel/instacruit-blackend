const express = require("express");
const router = express.Router();
// const { saveFormData } = require("../controllers/formController");
const { saveFormData } = require("../controllers/orespørselsinformasjonsfelt");

// Route to save form data
router.post("/save", saveFormData);

module.exports = router;
