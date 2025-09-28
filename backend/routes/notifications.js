const express = require('express');
const {
  getNotifications,
  getNotification,
  createNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getNotificationStats,
} = require('../controllers/notificationController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// REST API routes
router.route('/')
  .get(getNotifications)
  .post(createNotification);

router.route('/stats')
  .get(getNotificationStats);

router.route('/read-all')
  .put(markAllAsRead);

router.route('/:id')
  .get(getNotification)
  .delete(deleteNotification);

router.route('/:id/read')
  .put(markAsRead);

module.exports = router;
