const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// We used to rely on the `multer-storage-cloudinary` adapter which declares
// a peer dependency on `cloudinary@^1.x`. To avoid that dependency conflict
// we now use `multer.memoryStorage()` for Cloudinary uploads and upload the
// buffer explicitly using the Cloudinary SDK. When Cloudinary isn't
// configured we fall back to local disk storage in the controller.

// Support both CLOUDINARY_* env var names AND legacy CLOUD_* names
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const cloudKey = process.env.CLOUDINARY_KEY || process.env.CLOUD_API_KEY;
const cloudSecret = process.env.CLOUDINARY_SECRET || process.env.CLOUD_API_SECRET;

let storage = null;
let isCloud = false;
if (cloudName && cloudKey && cloudSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudKey,
    api_secret: cloudSecret,
  });

  // Use multer memory storage for Cloudinary uploads and perform the
  // actual Cloudinary upload from the buffer at request time.
  storage = multer.memoryStorage();
  isCloud = true;
  console.log('cloudConfig: Cloudinary configured — using memory storage');
} else {
  console.log('cloudConfig: Cloudinary not configured (env vars not set)');
}

module.exports = { cloudinary, storage, isCloud };
