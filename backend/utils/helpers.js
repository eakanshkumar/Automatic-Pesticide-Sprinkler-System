const crypto = require('crypto');

// Generate random token
exports.generateRandomToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Calculate spray efficiency
exports.calculateEfficiency = (traditionalUsage, precisionUsage) => {
  if (traditionalUsage <= 0) return 0;
  return ((traditionalUsage - precisionUsage) / traditionalUsage) * 100;
};

// Format data for charts
exports.formatChartData = (data, xField, yField) => {
  return data.map(item => ({
    x: item[xField],
    y: item[yField]
  }));
};

// Pagination
exports.getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  
  return { limit, offset };
};

exports.getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  
  return { totalItems, items, totalPages, currentPage };
};