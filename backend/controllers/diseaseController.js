const ErrorResponse = require('../utils/errorResponse');

// @desc    Analyze plant disease
// @route   POST /api/disease/analyze
// @access  Private
exports.analyzeDisease = async (req, res, next) => {
  try {
    // This is where you'll integrate with your ML model API
    // For now, returning mock data - replace with actual API call
    
    // Example integration with your ML API:
    const mlResponse = await fetch('http://10.112.146.21:8080', {
      method: 'POST',
      body: req.file.buffer,
      headers: { 'Authorization': `Bearer ${process.env.ML_API_KEY}` }
    });
    const result = await mlResponse.json();

    // Mock response - replace with actual ML API response
    // const mockResults = [
    //   { diseaseType: 'powdery_mildew', infectionLevel: 'moderate', confidence: 0.87 },
    //   { diseaseType: 'leaf_rust', infectionLevel: 'severe', confidence: 0.92 },
    //   { diseaseType: 'blight', infectionLevel: 'mild', confidence: 0.78 },
    //   { diseaseType: 'healthy', infectionLevel: 'none', confidence: 0.95 }
    // ];

    // const result = mockResults[Math.floor(Math.random() * mockResults.length)];

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};