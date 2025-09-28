const express = require('express');
const router = express.Router();
const { uploadImage, handleImageUpload } = require('../middleware/upload');

// POST route for image upload
router.post('/', uploadImage, handleImageUpload);

module.exports = router;