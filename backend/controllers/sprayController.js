const SprayEvent = require('../models/SprayEvent');
const Farm = require('../models/Farm');
const ErrorResponse = require('../utils/errorResponse');
const { sendAlertEmail, sendAlertSMS } = require('../utils/notificationService');

// @desc    Get all spray events for a farm
// @route   GET /api/spray
// @access  Private
exports.getSprayEvents = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = SprayEvent.find(JSON.parse(queryStr)).populate('farm', 'name location');

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-startTime');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await SprayEvent.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const sprayEvents = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: sprayEvents.length,
      pagination,
      data: sprayEvents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single spray event
// @route   GET /api/spray/:id
// @access  Private
exports.getSprayEvent = async (req, res, next) => {
  try {
    const sprayEvent = await SprayEvent.findById(req.params.id).populate('farm', 'name location');

    if (!sprayEvent) {
      return next(
        new ErrorResponse(`Spray event not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: sprayEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new spray event
// @route   POST /api/spray
// @access  Private
exports.createSprayEvent = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.initiatedBy = req.user.id;

    const sprayEvent = await SprayEvent.create(req.body);

    res.status(201).json({
      success: true,
      data: sprayEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update spray event
// @route   PUT /api/spray/:id
// @access  Private
exports.updateSprayEvent = async (req, res, next) => {
  try {
    let sprayEvent = await SprayEvent.findById(req.params.id);

    if (!sprayEvent) {
      return next(
        new ErrorResponse(`Spray event not found with id of ${req.params.id}`, 404)
      );
    }

    sprayEvent = await SprayEvent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: sprayEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete spray event
// @route   DELETE /api/spray/:id
// @access  Private
exports.deleteSprayEvent = async (req, res, next) => {
  try {
    const sprayEvent = await SprayEvent.findById(req.params.id);

    if (!sprayEvent) {
      return next(
        new ErrorResponse(`Spray event not found with id of ${req.params.id}`, 404)
      );
    }

    await SprayEvent.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get spray statistics
// @route   GET /api/spray/stats/overview
// @access  Private
exports.getSprayStats = async (req, res, next) => {
  try {
    const totalSprayEvents = await SprayEvent.countDocuments();
    const totalPesticideUsed = await SprayEvent.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$pesticideUsed' }
        }
      }
    ]);
    
    const totalAreaCovered = await SprayEvent.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$areaCovered' }
        }
      }
    ]);
    
    const averageEfficiency = await SprayEvent.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: '$efficiency.accuracy' }
        }
      }
    ]);

    // Get spray events by day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSprayEvents = await SprayEvent.countDocuments({
      startTime: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalSprayEvents,
        totalPesticideUsed: totalPesticideUsed[0]?.total || 0,
        totalAreaCovered: totalAreaCovered[0]?.total || 0,
        averageEfficiency: averageEfficiency[0]?.average || 0,
        recentSprayEvents
      }
    });
  } catch (error) {
    next(error);
  }
};