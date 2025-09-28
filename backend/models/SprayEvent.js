const mongoose = require('mongoose');

const sprayEventSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  field: {
    type: String,
    required: true
  },
  triggeredBy: {
    type: String,
    enum: ['auto', 'manual', 'scheduled'],
    required: true
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  duration: Number, // in minutes
  pesticideUsed: {
    type: Number,
    required: true
  }, // in liters
  areaCovered: {
    type: Number,
    required: true
  }, // in hectares
  infectionData: {
    preSprayInfectionRate: Number,
    detectedDiseases: [String],
    severity: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  weatherConditions: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    condition: String
  },
  efficiency: {
    pesticideSaved: Number, // percentage compared to traditional spraying
    accuracy: Number // percentage of spray applied to infected areas
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'failed', 'cancelled'],
    default: 'completed'
  },
  notes: String
}, {
  timestamps: true
});

// Index for efficient querying
sprayEventSchema.index({ farm: 1, startTime: -1 });

module.exports = mongoose.model('SprayEvent', sprayEventSchema);