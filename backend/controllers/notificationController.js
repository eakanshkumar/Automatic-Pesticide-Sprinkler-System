const Notification = require('../models/Notification');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const { sendAlertEmail, sendAlertSMS } = require('../utils/notificationService');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const { read, type, limit = 20 } = req.query;
    
    let query = { user: req.user.id };
    
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    if (type) {
      query.type = type;
    }
    
    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
exports.getNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(
        new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the notification
    if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to access this notification`, 401)
      );
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(
        new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the notification
    if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to update this notification`, 401)
      );
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
exports.createNotification = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    
    const notification = await Notification.create(req.body);
    
    // Send via configured channels if specified
    if (req.body.channels && req.body.channels.length > 0) {
      const user = await User.findById(req.user.id);
      
      if (req.body.channels.includes('email') && user.notifications.email) {
        await sendAlertEmail(user, {
          title: req.body.title,
          message: req.body.message
        });
      }
      
      if (req.body.channels.includes('sms') && user.notifications.sms && user.phone) {
        await sendAlertSMS(user, {
          title: req.body.title,
          message: req.body.message
        });
      }
      
      notification.sent = true;
      notification.sentAt = new Date();
      await notification.save();
    }

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(
        new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the notification
    if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to delete this notification`, 401)
      );
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private
exports.getNotificationStats = async (req, res, next) => {
  try {
    const totalNotifications = await Notification.countDocuments({ user: req.user.id });
    const unreadNotifications = await Notification.countDocuments({ 
      user: req.user.id, 
      read: false 
    });
    
    const notificationTypes = await Notification.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalNotifications,
        unreadNotifications,
        byType: notificationTypes
      }
    });
  } catch (error) {
    next(error);
  }
};