const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const rentalController = require("../controllers/rental.controller");

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
router.post("/create", authMiddleware, upload.single("image"), rentalController.createRental);
router.put("/update/:id", authMiddleware, rentalController.updateRental);
router.put("/replace/:id", authMiddleware, upload.single("image"), rentalController.replaceImage);
router.delete("/delete/:id", authMiddleware, rentalController.deleteRental);
router.get("/", rentalController.getAllRentals);

module.exports = router;
