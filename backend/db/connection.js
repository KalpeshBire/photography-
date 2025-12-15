const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URI || "mongodb://localhost:27017/newonePhoto";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

module.exports = mongoose.connection;
