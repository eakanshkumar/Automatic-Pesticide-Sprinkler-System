const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');
const { sendSMS } = require('./smsService');

/**
 * Create and send a notification
 * @param {Object} notificationData - Notification data
 * @param {String} notificationData.user - User ID
 * @param {String} notificationData.type - Notification type (alert, warning, info, success, error)
 * @param {String} notificationData.title - Notification title
 * @param {String} notificationData.message - Notification message
 * @param {Object} notificationData.relatedEntity - Related entity data
 * @param {String} notificationData.priority - Priority level (low, medium, high, critical)
 * @param {Array} notificationData.channels - Channels to send through (in-app, email, sms, whatsapp)
 * @returns {Promise<Object>} Created notification
 */
exports.createNotification = async (notificationData) => {
  try {
    // Create the notification in database
    const notification = await Notification.create(notificationData);

    // Send through configured channels
    await this.sendNotificationThroughChannels(notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Send notification through configured channels
 * @param {Object} notification - Notification object
 */
exports.sendNotificationThroughChannels = async (notification) => {
  const { user, channels, type, title, message } = notification;

  try {
    // Get user preferences (in a real app, you'd fetch user data)
    const userData = await User.findById(user).select('email phone notifications');
    
    if (!userData) {
      console.error('User not found for notification');
      return;
    }

    const sentChannels = [];

    // Send via email if configured
    if (channels.includes('email') && userData.notifications?.email && userData.email) {
      try {
        await this.sendEmailNotification(userData.email, title, message, type);
        sentChannels.push('email');
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    // Send via SMS if configured
    if (channels.includes('sms') && userData.notifications?.sms && userData.phone) {
      try {
        await this.sendSMSNotification(userData.phone, message);
        sentChannels.push('sms');
      } catch (error) {
        console.error('Failed to send SMS notification:', error);
      }
    }

    // Send via WhatsApp if configured (would require WhatsApp Business API integration)
    if (channels.includes('whatsapp') && userData.notifications?.whatsapp && userData.phone) {
      try {
        await this.sendWhatsAppNotification(userData.phone, message);
        sentChannels.push('whatsapp');
      } catch (error) {
        console.error('Failed to send WhatsApp notification:', error);
      }
    }

    // Update notification with sent status
    if (sentChannels.length > 0) {
      await Notification.findByIdAndUpdate(notification._id, {
        sent: true,
        sentAt: new Date(),
        channels: sentChannels
      });
    }

    return sentChannels;
  } catch (error) {
    console.error('Error sending notification through channels:', error);
  }
};

/**
 * Send email notification
 * @param {String} email - Recipient email
 * @param {String} subject - Email subject
 * @param {String} message - Email message
 * @param {String} type - Notification type
 */
exports.sendEmailNotification = async (email, subject, message, type = 'info') => {
  const emailTemplate = this.generateEmailTemplate(subject, message, type);
  
  return sendEmail(email, subject, emailTemplate);
};

/**
 * Send SMS notification
 * @param {String} phone - Recipient phone number
 * @param {String} message - SMS message
 */
exports.sendSMSNotification = async (phone, message) => {
  // Truncate message to SMS limits
  const truncatedMessage = message.length > 160 ? message.substring(0, 157) + '...' : message;
  
  return sendSMS(phone, truncatedMessage);
};

/**
 * Send WhatsApp notification (placeholder - would require WhatsApp Business API)
 * @param {String} phone - Recipient phone number
 * @param {String} message - WhatsApp message
 */
exports.sendWhatsAppNotification = async (phone, message) => {
  // This is a placeholder implementation
  // In a real application, you would integrate with WhatsApp Business API
  console.log(`WhatsApp notification would be sent to ${phone}: ${message}`);
  return true;
};

/**
 * Generate email template for notification
 * @param {String} subject - Email subject
 * @param {String} message - Email message
 * @param {String} type - Notification type
 * @returns {String} HTML email template
 */
exports.generateEmailTemplate = (subject, message, type = 'info') => {
  const colors = {
    alert: '#ff9800',
    warning: '#ff5722',
    info: '#2196f3',
    success: '#4caf50',
    error: '#f44336'
  };

  const icon = {
    alert: '⚠️',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅',
    error: '❌'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${colors[type]}; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${icon[type]} ${subject}</h1>
        </div>
        <div class="content">
          <p>${message}</p>
          <p>This is an automated message from KrishiNetra System.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} KrishiNetra. All rights reserved.</p>
          <p><a href="#">Unsubscribe</a> from these notifications</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send critical alert notification (bypasses user preferences)
 * @param {String} userId - User ID
 * @param {String} title - Alert title
 * @param {String} message - Alert message
 * @param {Object} relatedEntity - Related entity data
 */
exports.sendCriticalAlert = async (userId, title, message, relatedEntity = null) => {
  return this.createNotification({
    user: userId,
    type: 'alert',
    title,
    message,
    relatedEntity,
    priority: 'critical',
    channels: ['in-app', 'email', 'sms'] // Force critical alerts through all channels
  });
};

/**
 * Send system-wide notification to all users
 * @param {String} title - Notification title
 * @param {String} message - Notification message
 * @param {String} type - Notification type
 * @param {Array} channels - Channels to use
 */
exports.sendBroadcastNotification = async (title, message, type = 'info', channels = ['in-app', 'email']) => {
  try {
    // Get all active users
    const users = await User.find({ isActive: true }).select('_id');
    
    const notifications = [];
    
    for (const user of users) {
      const notification = await this.createNotification({
        user: user._id,
        type,
        title,
        message,
        priority: 'high',
        channels
      });
      
      notifications.push(notification);
    }
    
    return notifications;
  } catch (error) {
    console.error('Error sending broadcast notification:', error);
    throw error;
  }
};

/**
 * Get notification statistics
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Notification statistics
 */
exports.getNotificationStats = async (userId) => {
  try {
    const total = await Notification.countDocuments({ user: userId });
    const unread = await Notification.countDocuments({ user: userId, read: false });
    
    const byType = await Notification.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const recent = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('type title read createdAt');
    
    return {
      total,
      unread,
      byType,
      recent
    };
  } catch (error) {
    console.error('Error getting notification stats:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {String} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
exports.markAsRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(
    notificationId,
    { read: true, readAt: new Date() },
    { new: true }
  );
};

/**
 * Mark all notifications as read for a user
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Update result
 */
exports.markAllAsRead = async (userId) => {
  return Notification.updateMany(
    { user: userId, read: false },
    { read: true, readAt: new Date() }
  );
};

/**
 * Clean up old notifications
 * @param {Number} daysOld - Delete notifications older than this many days
 * @returns {Promise<Object>} Delete result
 */
exports.cleanupOldNotifications = async (daysOld = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return Notification.deleteMany({
    createdAt: { $lt: cutoffDate },
    priority: { $ne: 'critical' } // Keep critical notifications forever
  });
};

module.exports = exports;