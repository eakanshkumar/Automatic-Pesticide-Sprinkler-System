const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['alert', 'warning', 'info', 'success', 'error'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedEntity: {
    type: {
      type: String,
      enum: ['spray', 'farm', 'sensor', 'system']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  channels: [{
    type: String,
    enum: ['in-app', 'email', 'sms', 'whatsapp']
  }],
  read: {
    type: Boolean,
    default: false
  },
  sent: {
    type: Boolean,
    default: false
  },
  sentAt: Date,
  expiresAt: Date
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);