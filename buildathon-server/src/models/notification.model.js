const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "campaign_created",
      "negotiation_request",
      "negotiation_accepted",
      "negotiation_rejected",
      "influencer_confirmed",
      "offer_sent",
      "offer_accepted",
      "offer_rejected",
    ],
  },
  message: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: null,
    trim: true,
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign", // Refers to your Campaign model
    default: null,
    index: true,
  },
  link: {
    type: String,
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
  //Link to the specific entity that triggered the notification
  relatedEntity: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedEntity.type",
      default: null,
    },
    type: {
      type: String,
      enum: ["Campaign", "Negotiation", "Influencer", null], // Add relevant model names
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Index for sorting by time
  },
});

notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
