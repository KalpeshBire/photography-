const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    serviceType: {
      type: String,
      enum: ["Photography", "Videography", "LED", "Drone"],
      required: true
    },
    description: String,
    pricing: {
      type: {
        type: String,
        enum: ["per day", "per event", "custom"],
        required: true
      },
      basePrice: Number
    },
    image: {
      url: String, // Local path relative to server root e.g., "uploads/filename.jpg"
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
