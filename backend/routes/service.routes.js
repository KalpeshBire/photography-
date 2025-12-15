const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const serviceController = require("../controllers/service.controller");

const { storage, isCloud } = require("../config/cloudinaryConfig");

// Multer Storage Configuration
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
router.post("/create", authMiddleware, upload.single("image"), serviceController.createService);
router.put("/update/:id", authMiddleware, serviceController.updateService);
router.put("/replace/:id", authMiddleware, upload.single("image"), serviceController.replaceImage);
router.delete("/delete/:id", authMiddleware, serviceController.deleteService);
router.get("/", serviceController.getAllServices);

module.exports = router;
