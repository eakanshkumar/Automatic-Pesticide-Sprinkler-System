const Farm = require('../models/Farm');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all farms for a user
// @route   GET /api/farms
// @access  Private
exports.getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find({ owner: req.user.id })
      .populate('owner', 'name email')
      .select('-fields -sensors'); // Exclude heavy data for list view

    res.status(200).json({
      success: true,
      count: farms.length,
      data: farms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farm
// @route   GET /api/farms/:id
// @access  Private
exports.getFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('owner', 'name email');

    if (!farm) {
      return next(
        new ErrorResponse(`Farm not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the farm
    if (farm.owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to access this farm`, 401)
      );
    }

    res.status(200).json({
      success: true,
      data: farm
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new farm
// @route   POST /api/farms
// @access  Private
exports.createFarm = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.owner = req.user.id;

    // Ensure crops is an array and handle empty case
    if (req.body.crops && !Array.isArray(req.body.crops)) {
      req.body.crops = [req.body.crops];
    }

    // Ensure images is an array
    if (req.body.images && !Array.isArray(req.body.images)) {
      req.body.images = [req.body.images];
    }

    const farm = await Farm.create(req.body);

    res.status(201).json({
      success: true,
      data: farm
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
exports.updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findById(req.params.id);

    if (!farm) {
      return next(
        new ErrorResponse(`Farm not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the farm
    if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to update this farm`, 401)
      );
    }

    // Handle images array updates
    if (req.body.images) {
      if (!Array.isArray(req.body.images)) {
        req.body.images = [req.body.images];
      }
      // Merge existing images with new ones, avoiding duplicates
      const existingImages = farm.images.map(img => img.cloudinaryId);
      const newImages = req.body.images.filter(img => 
        !existingImages.includes(img.cloudinaryId)
      );
      req.body.images = [...farm.images, ...newImages];
    }

    // Handle crops array updates
    if (req.body.crops && !Array.isArray(req.body.crops)) {
      req.body.crops = [req.body.crops];
    }

    farm = await Farm.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    ).populate('owner', 'name email');

    res.status(200).json({
      success: true,
      data: farm
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
exports.deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return next(
        new ErrorResponse(`Farm not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the farm
    if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to delete this farm`, 401)
      );
    }

    await Farm.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add image to farm
// @route   POST /api/farms/:id/images
// @access  Private
exports.addFarmImage = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return next(
        new ErrorResponse(`Farm not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the farm
    if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to update this farm`, 401)
      );
    }

    const { url, cloudinaryId } = req.body;

    if (!url || !cloudinaryId) {
      return next(
        new ErrorResponse('Please provide both image URL and Cloudinary ID', 400)
      );
    }

    const newImage = {
      url,
      cloudinaryId,
      uploadedAt: new Date()
    };

    farm.images.push(newImage);
    await farm.save();

    res.status(200).json({
      success: true,
      data: farm
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove image from farm
// @route   DELETE /api/farms/:id/images/:imageId
// @access  Private
exports.removeFarmImage = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return next(
        new ErrorResponse(`Farm not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the farm
    if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to update this farm`, 401)
      );
    }

    farm.images = farm.images.filter(
      image => image.cloudinaryId !== req.params.imageId
    );

    await farm.save();

    res.status(200).json({
      success: true,
      data: farm
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farms within radius
// @route   GET /api/farms/radius/:zipcode/:distance
// @access  Private
exports.getFarmsInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 6378;

    const farms = await Farm.find({
      'location.coordinates': {
        $geoWithin: { $centerSphere: [[lng, lat], radius] }
      }
    }).select('-fields -sensors -images'); // Lightweight response for radius queries

    res.status(200).json({
      success: true,
      count: farms.length,
      data: farms
    });
  } catch (error) {
    next(error);
  }
};