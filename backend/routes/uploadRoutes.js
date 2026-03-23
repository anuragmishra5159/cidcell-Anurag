const express = require('express');
const router = express.Router();
const { upload, handleUpload } = require('../config/cloudinaryConfig');

// @route   POST api/upload
// @desc    Upload an image to Cloudinary
// @access  Private (though authentication should be handled by middleware)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const result = await handleUpload(req.file.buffer, {
      public_id: `file-${Date.now()}`,
    });
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('❌ Upload Error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// For multiple images
router.post('/multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const results = await Promise.all(
      req.files.map((file) =>
        handleUpload(file.buffer, { public_id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}` })
      )
    );
    const urls = results.map((r) => ({ url: r.secure_url, public_id: r.public_id }));
    res.json({ urls });
  } catch (err) {
    console.error('❌ Multiple Upload Error:', err);
    res.status(500).json({ message: 'Server error during multiple upload', error: err.message });
  }
});

module.exports = router;

