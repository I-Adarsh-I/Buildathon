const mongoose = require("mongoose");

const negotiationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // The campaign creator
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "confirmed"],
      default: "pending",
    },
    offerAmount: { type: Number },
    // ... other negotiation details
  },
  { timestamps: true }
);

const Negotiation = mongoose.model("Negotiation", negotiationSchema);
module.exports = Negotiation;
