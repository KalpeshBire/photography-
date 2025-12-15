const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const multer = require("multer");
 
const express = require("express");
const cors = require("cors");

const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
require("./db/connection"); // Connect DB

// Import Middlewares
const loggerMiddleware = require("./middleware/logger.middleware");
const authMiddleware = require("./middleware/auth.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 Created uploads directory");
}

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/newonePhoto", // Same as in db/connection.js
    collectionName: "sessions",
});

const sessionOperation = {
  store: store,
  secret: "danger",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // Ensure cookies are sent in cross-site requests during development
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

// Global Middleware
// CORS: allow frontend origin and credentials for cookie-based sessions
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser("danger"));
app.use(session(sessionOperation));
app.use(loggerMiddleware); // Log every request

// Serve Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/auth.routes");
const galleryRoutes = require("./routes/gallery.routes.js");
const serviceRoutes = require("./routes/service.routes.js");
const rentalRoutes = require("./routes/rental.routes.js");

// Public Routes
app.use("/api/auth", authRoutes);

// Protected Admin Routes
app.use("/api/admin/gallery", authMiddleware, galleryRoutes);
app.use("/api/admin/services", authMiddleware, serviceRoutes);
app.use("/api/admin/rentals", authMiddleware, rentalRoutes);

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
    });
}

// 404 - Route Not Found Handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📂 Serving uploads at http://localhost:${PORT}/uploads`);
  if (process.env.SAVE_LOCAL_COPY === "true") {
    console.log("💾 SAVE_LOCAL_COPY is enabled — Cloud uploads will also save a local copy in /uploads");
  }
});
