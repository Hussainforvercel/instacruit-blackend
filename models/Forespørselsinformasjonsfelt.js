const mongoose = require("mongoose");

const ForespørselsinformasjonsfeltSchema = new mongoose.Schema({
  fields: [
    {
      value: { type: String, required: true }, // Each field's value
    },
  ],
  askForCV: { type: Boolean, required: true }, // Checkbox to ask for CV
});

// Exporting the model, not the schema
const FormData = mongoose.model("FormData", ForespørselsinformasjonsfeltSchema);

module.exports = FormData;
