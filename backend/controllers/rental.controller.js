const Rental = require("../models/Rental");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryHelper");
 
// Create Rental (Upload)
exports.createRental = async (req, res) => {
  try {
    const { name, type, specs, pricePerDay, quantity, active } = req.body;
    
    let imageUrl = "";

    if (req.file) {
      if (req.file.buffer) {
        const result = await uploadToCloudinary(req.file.buffer, "rentals", req.file.originalname);
        imageUrl = result.secure_url;
      } else {
        imageUrl = `uploads/${req.file.filename}`;
      }
    }

    const rental = new Rental({
      name,
      type,
      specs,
      pricePerDay,
      quantity,
      active: active === "true",
      image: { url: imageUrl }
    });

    await rental.save();
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Details (No file change)
exports.updateDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, specs, pricePerDay, quantity, active } = req.body;
    
    const updateData = {
        name,
        type,
        specs,
        pricePerDay,
        quantity,
        active: active === "true"
    };

    const updatedRental = await Rental.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedRental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Replace Image (File change)
exports.replaceImage = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id);

    if (!rental) return res.status(404).json({ error: "Rental not found" });

    // Delete old file
    if (rental.image && rental.image.url) {
        if (rental.image.url.includes("cloudinary.com")) {
            await deleteFromCloudinary(rental.image.url);
        } else {
            const oldPath = path.join(__dirname, "..", rental.image.url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
    }

    // Update with new file
    if (req.file) {
      if (req.file.buffer) {
        const result = await uploadToCloudinary(req.file.buffer, "rentals", req.file.originalname);
        rental.image.url = result.secure_url;
      } else {
        rental.image.url = `uploads/${req.file.filename}`;
      }
    }

    await rental.save();
    
    res.status(200).json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Rental
exports.deleteRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id);

    if (!rental) return res.status(404).json({ error: "Rental not found" });

    // Delete file
    if (rental.image && rental.image.url) {
        if (rental.image.url.includes("cloudinary.com")) {
            await deleteFromCloudinary(rental.image.url);
        } else {
            const filePath = path.join(__dirname, "..", rental.image.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }

    await Rental.findByIdAndDelete(id);
    res.status(200).json({ message: "Rental deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ createdAt: -1 });
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
