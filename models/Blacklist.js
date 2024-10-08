const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1d", // Automatically remove after 1 day (adjust based on JWT expiration time)
  },
});

module.exports = mongoose.model("Blacklist", blacklistSchema);
