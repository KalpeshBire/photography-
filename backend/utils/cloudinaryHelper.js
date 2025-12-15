const { cloudinary } = require("../config/cloudinaryConfig");
const streamifier = require("streamifier");
const multer = require('multer');
const fs = require("fs");
const path = require("path");

/**
 * Uploads a file buffer to Cloudinary
 * Optionally saves a local copy when `SAVE_LOCAL_COPY=true`.
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Folder name in Cloudinary
 * @param {string|null} originalName - Original filename (used when saving local copy)
 * @returns {Promise<object>} - Cloudinary upload result (adds `localPath` when saved)
 */
exports.uploadToCloudinary = (buffer, folder = "uploads", originalName = null) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (result) {
          // Optionally save a local copy for debugging or local serving
          try {
            if (process.env.SAVE_LOCAL_COPY === "true" && originalName) {
              const uploadsDir = path.join(__dirname, "..", "uploads");
              if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
              const safeName = `${Date.now()}-${originalName.replace(/\s+/g, "_")}`;
              const filePath = path.join(uploadsDir, safeName);
              fs.writeFileSync(filePath, buffer);
              result.localPath = `uploads/${safeName}`;
              console.log(`Saved local copy of upload to ${result.localPath}`);
            }
          } catch (e) {
            // Don't block upload on local-save failure
            console.warn("Failed to save local copy of upload:", e.message);
          }

          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Deletes a file from Cloudinary using its public ID
 * @param {string} url - The full Cloudinary URL
 * @returns {Promise<object>} - Cloudinary deletion result
 */
exports.deleteFromCloudinary = async (url) => {
  try {
    // Extract public ID from URL
    // Format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<public_id>.<ext>
    // We need: <folder>/<public_id>
    
    if (!url.includes("cloudinary.com")) return null;

    const parts = url.split("/");
    const filename = parts.pop();
    const publicIdWithExt = filename.split(".")[0]; 
    const folder = parts.pop(); // Assuming one level of folder
    // If multiple folders, this logic needs to be more robust.
    // However, we used "uploads" folder above.
    
    // Better Regex extraction:
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
    const match = url.match(regex);
    
    if (match && match[1]) {
       const publicId = match[1];
       return await cloudinary.uploader.destroy(publicId);
    }
    return null;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw error;
  }
};
