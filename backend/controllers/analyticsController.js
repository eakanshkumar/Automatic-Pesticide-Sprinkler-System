const Analytics = require('../models/Analytics');
const SprayEvent = require('../models/SprayEvent');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get analytics for a farm
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const { farmId, startDate, endDate, groupBy = 'day' } = req.query;
    
    let matchStage = {};
    
    if (farmId) {
      matchStage.farm = farmId;
    }
    
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }
    
    let groupStage = {
      _id: null,
      totalPesticideUsed: { $sum: '$metrics.pesticideUsed' },
      totalAreaSprayed: { $sum: '$metrics.areaSprayed' },
      avgInfectionRate: { $avg: '$metrics.infectionRate' },
      avgDetectionAccuracy: { $avg: '$metrics.detectionAccuracy' },
      totalWaterSaved: { $sum: '$metrics.waterSaved' },
      totalCostSavings: { $sum: '$metrics.costSavings' }
    };
    
    if (groupBy !== 'overall') {
      let dateFormat = '%Y-%m-%d';
      if (groupBy === 'month') dateFormat = '%Y-%m';
      if (groupBy === 'year') dateFormat = '%Y';
      
      groupStage = {
        _id: { $dateToString: { format: dateFormat, date: '$date' } },
        pesticideUsed: { $sum: '$metrics.pesticideUsed' },
        areaSprayed: { $sum: '$metrics.areaSprayed' },
        infectionRate: { $avg: '$metrics.infectionRate' },
        detectionAccuracy: { $avg: '$metrics.detectionAccuracy' },
        waterSaved: { $sum: '$metrics.waterSaved' },
        costSavings: { $sum: '$metrics.costSavings' }
      };
    }
    
    const analytics = await Analytics.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get efficiency comparison
// @route   GET /api/analytics/efficiency
// @access  Private
exports.getEfficiencyComparison = async (req, res, next) => {
  try {
    const { farmId } = req.query;
    
    let matchStage = {};
    if (farmId) matchStage.farm = farmId;
    
    const efficiencyData = await Analytics.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          traditionalPesticide: { $sum: '$comparisons.traditionalMethod.pesticideUsed' },
          precisionPesticide: { $sum: '$comparisons.precisionMethod.pesticideUsed' },
          traditionalCost: { $sum: '$comparisons.traditionalMethod.cost' },
          precisionCost: { $sum: '$comparisons.precisionMethod.cost' },
          traditionalImpact: { $avg: '$comparisons.traditionalMethod.environmentalImpact' },
          precisionImpact: { $avg: '$comparisons.precisionMethod.environmentalImpact' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: efficiencyData.length > 0 ? efficiencyData[0] : {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get infection trends
// @route   GET /api/analytics/infection-trends
// @access  Private
exports.getInfectionTrends = async (req, res, next) => {
  try {
    const { farmId, days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    let matchStage = { date: { $gte: startDate } };
    if (farmId) matchStage.farm = farmId;
    
    const trends = await Analytics.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          infectionRate: { $avg: '$metrics.infectionRate' },
          detectionAccuracy: { $avg: '$metrics.detectionAccuracy' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate analytics report
// @route   POST /api/analytics/generate-report
// @access  Private
exports.generateReport = async (req, res, next) => {
  try {
    const { farmId, startDate, endDate, reportType } = req.body;
    
    // This would typically generate a PDF or detailed report
    // For now, we'll return aggregated data
    
    let matchStage = {};
    if (farmId) matchStage.farm = farmId;
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }
    
    const reportData = await Analytics.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPesticideUsed: { $sum: '$metrics.pesticideUsed' },
          totalAreaSprayed: { $sum: '$metrics.areaSprayed' },
          avgInfectionRate: { $avg: '$metrics.infectionRate' },
          avgDetectionAccuracy: { $avg: '$metrics.detectionAccuracy' },
          totalWaterSaved: { $sum: '$metrics.waterSaved' },
          totalCostSavings: { $sum: '$metrics.costSavings' },
          traditionalPesticide: { $sum: '$comparisons.traditionalMethod.pesticideUsed' },
          precisionPesticide: { $sum: '$comparisons.precisionMethod.pesticideUsed' },
          traditionalCost: { $sum: '$comparisons.traditionalMethod.cost' },
          precisionCost: { $sum: '$comparisons.precisionMethod.cost' }
        }
      }
    ]);
    
    const sprayEvents = await SprayEvent.find(matchStage)
      .populate('farm', 'name')
      .sort('-startTime')
      .limit(50);

    res.status(200).json({
      success: true,
      data: {
        summary: reportData.length > 0 ? reportData[0] : {},
        recentSprayEvents: sprayEvents,
        generatedAt: new Date(),
        reportType,
        dateRange: {
          start: startDate,
          end: endDate
        }
      }
    });
  } catch (error) {
    next(error);
  }
};