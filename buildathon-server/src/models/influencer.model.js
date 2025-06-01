const mongoose = require("mongoose");

const youtubePlatformSchema = new mongoose.Schema(
  {
    channel_link: { type: String, trim: true },
    channel_name: { type: String, required: true, trim: true },
    subscribers: { type: Number, default: 0 },
    total_views: { type: Number, default: 0 },
    total_videos: { type: Number, default: 0 },
  },
  { _id: false }
);

const instagramPlatformSchema = new mongoose.Schema(
  {
    profile_handle: { type: String, trim: true },
    followers: { type: Number, default: 0 },
  },
  { _id: false }
);

// Main Influencer Schema
const influencerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    contact_email: { type: String, trim: true, lowercase: true, sparse: true },
    bio: { type: String },
    profile_image: { type: String, default: null },

    youtube: youtubePlatformSchema,
    instagram: instagramPlatformSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Influencer", influencerSchema);
