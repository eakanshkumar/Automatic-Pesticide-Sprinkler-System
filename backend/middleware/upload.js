const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Configure multer for memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware for handling single image upload
exports.uploadImage = upload.single('image');

// Helper function for uploading buffer to Cloudinary
exports.uploadToCloudinary = async (fileBuffer, folder = 'smartspray') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
          transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error('Error uploading to Cloudinary: ' + error.message);
  }
};

// Controller function for handling image upload
exports.handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload to Cloudinary
    const result = await exports.uploadToCloudinary(req.file.buffer, 'smartspray');

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      imageId: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading image: ' + error.message
    });
  }
};