const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  media: {
    url: String, // Local path relative to server root e.g., "uploads/filename.jpg"
  },
  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true
  },
  category: {
    type: String,
    enum: ["Wedding", "Drone", "Event", "LED Screen", "Camera Rental"],
    required: true
  },
  price: {
    type: Number, // Optional price
    required: false
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Gallery", gallerySchema);
