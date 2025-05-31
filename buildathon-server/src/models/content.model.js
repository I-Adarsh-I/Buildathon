const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer'
  },
  contentType: {
    type: String,
    enum: ['video', 'post', 'reel']
  },
  title: String,
  mediaId: String,
  publishedAt: Date,
  views: Number,
  likes: Number,
  comments: Number,
  url: String,
  thumbnails: {
    default: String,
    medium: String,
    high: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
