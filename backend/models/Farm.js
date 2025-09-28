const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a farm name'],
    maxlength: 100
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  size: {
    type: Number,
    required: [true, 'Please provide farm size in hectares'],
    min: [0.1, 'Farm size must be at least 0.1 hectares']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State/Province is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  crops: [{
    type: String,
    enum: ['Wheat', 'Rice', 'Potatoes', 'Corn', 'Soybeans', 'Cotton', 'Tomatoes', 'Other']
  }],
  description: {
    type: String,
    maxlength: 1000
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    cloudinaryId: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  fields: [{
    name: String,
    size: Number,
    coordinates: [{
      lat: Number,
      lng: Number
    }],
    cropType: {
      type: String,
      enum: ['Wheat', 'Rice', 'Potatoes', 'Corn', 'Soybeans', 'Cotton', 'Tomatoes', 'Other']
    },
    soilType: String,
    irrigationSystem: String
  }],
  sensors: [{
    type: {
      type: String,
      enum: ['camera', 'moisture', 'temperature', 'humidity']
    },
    location: {
      lat: Number,
      lng: Number
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active'
    },
    lastReading: Date,
    batteryLevel: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
farmSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for getting total fields area - FIXED with null check
farmSchema.virtual('totalFieldsArea').get(function() {
  if (!this.fields || !Array.isArray(this.fields)) {
    return 0;
  }
  return this.fields.reduce((total, field) => total + (field.size || 0), 0);
});

// Virtual for getting active sensors count - FIXED with null check
farmSchema.virtual('activeSensorsCount').get(function() {
  if (!this.sensors || !Array.isArray(this.sensors)) {
    return 0;
  }
  return this.sensors.filter(sensor => sensor.status === 'active').length;
});

// Ensure virtual fields are serialized
farmSchema.set('toJSON', { virtuals: true });
farmSchema.set('toObject', { virtuals: true });

// Add default values for arrays to prevent undefined issues
farmSchema.pre('save', function(next) {
  if (this.fields === undefined) {
    this.fields = [];
  }
  if (this.sensors === undefined) {
    this.sensors = [];
  }
  if (this.crops === undefined) {
    this.crops = [];
  }
  if (this.images === undefined) {
    this.images = [];
  }
  next();
});

module.exports = mongoose.model('Farm', farmSchema);