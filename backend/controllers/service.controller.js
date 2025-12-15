const Service = require("../models/Service");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryHelper");
 
// Create Service (Upload)
exports.createService = async (req, res) => {
  try {
    const { name, serviceType, description, pricing_type, pricing_basePrice, active } = req.body;
    
    let imageUrl = "";

    if (req.file) {
           if (req.file.buffer) {
             const result = await uploadToCloudinary(req.file.buffer, "services", req.file.originalname);
             imageUrl = result.secure_url;
        } else {
             imageUrl = `uploads/${req.file.filename}`;
        }
    }

    const service = new Service({
      name,
      serviceType,
      description,
      pricing: {
          type: pricing_type,
          basePrice: pricing_basePrice
      },
      image: { url: imageUrl },
      active: active === "true"
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Details (No file change)
exports.updateDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, serviceType, description, pricing_type, pricing_basePrice, active } = req.body;
    
    const updateData = {
        name,
        serviceType,
        description,
        pricing: {
            type: pricing_type,
            basePrice: pricing_basePrice
        },
        active: active === "true"
    };

    const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Replace Image (File change)
exports.replaceImage = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) return res.status(404).json({ error: "Service not found" });

    // Delete old file
    if (service.image && service.image.url) {
        if (service.image.url.includes("cloudinary.com")) {
            await deleteFromCloudinary(service.image.url);
        } else {
            const oldPath = path.join(__dirname, "..", service.image.url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
    }

    // Update with new file
  if (req.file) {
    if (req.file.buffer) {
      const result = await uploadToCloudinary(req.file.buffer, "services", req.file.originalname);
      service.image.url = result.secure_url;
    } else {
      service.image.url = `uploads/${req.file.filename}`;
    }
    }

    await service.save();
    
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) return res.status(404).json({ error: "Service not found" });

    // Delete file
    if (service.image && service.image.url) {
        if (service.image.url.includes("cloudinary.com")) {
            await deleteFromCloudinary(service.image.url);
        } else {
             const filePath = path.join(__dirname, "..", service.image.url);
             if (fs.existsSync(filePath)) {
                 fs.unlinkSync(filePath);
             }
        }
    }

    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
