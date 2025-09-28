const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    pesticideUsed: Number, // in liters
    areaSprayed: Number, // in hectares
    infectionRate: Number, // percentage
    detectionAccuracy: Number, // percentage
    waterSaved: Number, // in liters compared to traditional methods
    costSavings: Number, // in local currency
    environmentalImpact: Number // estimated reduction in chemical runoff
  },
  trends: {
    dailyUsage: [{
      date: Date,
      pesticideUsed: Number,
      areaSprayed: Number
    }],
    infectionPatterns: [{
      date: Date,
      infectionRate: Number,
      dominantDisease: String
    }],
    efficiency: [{
      date: Date,
      accuracy: Number,
      savings: Number
    }]
  },
  comparisons: {
    traditionalMethod: {
      pesticideUsed: Number,
      cost: Number,
      environmentalImpact: Number
    },
    precisionMethod: {
      pesticideUsed: Number,
      cost: Number,
      environmentalImpact: Number
    }
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
analyticsSchema.index({ farm: 1, date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);