const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  // Only for local signups
  password: {
    type: String,
    default: null,
  },

  // Google OAuth-specific fields
  googleId: {
    type: String,
    default: null,
  },

  profilePhoto: {
    type: String,
    default: null,
  },

  interests: [String],

  languagePreference: {
    type: String,
    default: "en",
  },

  aiTags: [String],

  bio: {
    type: String,
    default: "",
  },

  // Role/permissions
  role: {
    type: String,
    enum: ["user", "creator", "admin"],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
