const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

if (process.env.CLOUDINARY_URL) {
  // If CLOUDINARY_URL is present, Cloudinary automatically configures itself.
} else if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary configuration missing in .env file (either CLOUDINARY_URL or CLOUD_NAME/API_KEY/API_SECRET required)');
}

// Cloudinary v2 SDK auto-picks CLOUDINARY_URL; fallback to individual vars.
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
  });
}

// Use memory storage — multer-storage-cloudinary only supports cloudinary v1.
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Upload a file buffer to Cloudinary v2 via a stream.
 * @param {Buffer} buffer - The file buffer from multer memoryStorage (req.file.buffer).
 * @param {object} [options] - Cloudinary upload_stream options (folder, public_id, etc.)
 * @returns {Promise<object>} Cloudinary upload result (contains .secure_url, .public_id, etc.)
 */
function handleUpload(buffer, options = {}) {
  const uploadOptions = {
    folder: 'cidcell',
    resource_type: 'auto',
    ...options,
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    Readable.from(buffer).pipe(stream);
  });
}

module.exports = { cloudinary, upload, handleUpload };
