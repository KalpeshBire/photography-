const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryHelper");

 
// Create Media (Upload)
exports.createMedia = async (req, res) => {
  try {
    const { title, description, category, mediaType, price, tags, isActive } = req.body;
    
    let mediaUrl = "";

    if (req.file) {
        if (req.file.buffer) {
          // Cloudinary Upload
          const result = await uploadToCloudinary(req.file.buffer, "gallery", req.file.originalname);
          mediaUrl = result.secure_url;
        } else {
            // Local Upload
            mediaUrl = `uploads/${req.file.filename}`;
        }
    }

    const gallery = new Gallery({
      title,
      description,
      category,
      mediaType,
      price,
      tags: tags ? tags.split(",") : [], 
      media: { url: mediaUrl },
      isActive: isActive === "true"
    });

    await gallery.save();
    res.status(201).json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Details (No file change)
exports.updateDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGallery = await Gallery.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedGallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Replace Media (File change)
exports.replaceMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) return res.status(404).json({ error: "Gallery item not found" });

    // Delete old file
    if (gallery.media.url) {
        if (gallery.media.url.includes("cloudinary.com")) {
            await deleteFromCloudinary(gallery.media.url);
        } else {
            const oldPath = path.join(__dirname, "..", gallery.media.url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
    }

    // Upload new file
      // Upload new file
      if (req.file) {
       if (req.file.buffer) {
        const result = await uploadToCloudinary(req.file.buffer, "gallery", req.file.originalname);
         gallery.media.url = result.secure_url;
       } else {
         gallery.media.url = `uploads/${req.file.filename}`;
       }
    }
    
    await gallery.save();
    
    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Media
exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) return res.status(404).json({ error: "Gallery item not found" });

    // Delete file
    if (gallery.media.url) {
        if (gallery.media.url.includes("cloudinary.com")) {
            await deleteFromCloudinary(gallery.media.url);
        } else {
            const filePath = path.join(__dirname, "..", gallery.media.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }

    await Gallery.findByIdAndDelete(id);
    res.status(200).json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All (with filters)
exports.getAllMedia = async (req, res) => {
  try {
    const { category, type } = req.query;
    let filter = {};
    if (category && category !== "All") filter.category = category;
    if (type) filter.mediaType = type;

    const galleries = await Gallery.find(filter).sort({ createdAt: -1 });
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
