const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Campaign name
  objective: { type: String, required: true },
  images: [ String ],
//   timeline: {
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true }
//   },
  budget: {
    total: { type: Number, required: true },
    perInfluencer: { type: Number }
  },
  platforms: [String],
  hashtags: [String],
  languagePreferences: [String],
  creatorCriteria: {
    niche: String,
    minFollowers: Number,
    maxFollowers: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Campaign', campaignSchema);
