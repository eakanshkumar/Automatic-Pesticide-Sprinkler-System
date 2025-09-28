import React from 'react';
import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">View insights and performance metrics</p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
};

export default Analytics;