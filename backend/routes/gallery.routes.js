const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const galleryController = require("../controllers/gallery.controller");

const { storage, isCloud } = require("../config/cloudinaryConfig");

// Multer Storage Configuration
// If Cloudinary is configured, 'storage' is memoryStorage. 
// If not, we want diskStorage. But cloudinaryConfig only exports storage if isCloud=true.
// Let's handle fallback here or assume config handles it.
// The config file exports { storage: null } if not cloud.
// So:
const uploadStorage = isCloud ? storage : multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: uploadStorage });

const authMiddleware = require("../middleware/auth.middleware");

// Routes
router.post("/create", authMiddleware, upload.single("media"), galleryController.createMedia);
router.put("/update/:id", authMiddleware, galleryController.updateDetails);
router.put("/replace/:id", authMiddleware, upload.single("media"), galleryController.replaceMedia);
router.delete("/delete/:id", authMiddleware, galleryController.deleteMedia);
router.get("/", galleryController.getAllMedia);

module.exports = router;
