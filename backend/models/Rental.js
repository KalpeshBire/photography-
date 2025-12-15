const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Camera", "Drone", "LED", "Lens", "Lighting", "Other"],
      required: true
    },
    specs: { type: String }, // Simplification: Storing specs as string/text
    pricePerDay: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    active: { type: Boolean, default: true }, // Changed from 'available' to 'active' for consistency
    image: {
      url: String, // Local path relative to server root
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rental", rentalSchema);
