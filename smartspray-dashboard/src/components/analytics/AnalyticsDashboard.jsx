import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analytics';
import EfficiencyChart from './Charts/EfficiencyChart';
import UsageChart from './Charts/UsageChart';
import InfectionChart from './Charts/InfectionChart';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

const AnalyticsDashboard = () => {
  const { data: analyticsData, isLoading, error } = useQuery(
    ['analytics'],
    analyticsService.getAnalytics
  );

  const { data: efficiencyData } = useQuery(
    ['efficiency'],
    analyticsService.getEfficiencyComparison
  );

  const { data: trendsData } = useQuery(
    ['infectionTrends'],
    () => analyticsService.getInfectionTrends({ days: 30 })
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load analytics" />;

  const analytics = analyticsData?.data || [];
  const efficiency = efficiencyData?.data || {};
  const trends = trendsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Pesticide Used</h3>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.reduce((sum, item) => sum + (item.metrics?.pesticideUsed || 0), 0).toFixed(1)}L
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Area Covered</h3>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.reduce((sum, item) => sum + (item.metrics?.areaSprayed || 0), 0).toFixed(1)}ha
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Efficiency</h3>
          <p className="text-2xl font-bold text-green-600">
            {efficiency.avgEfficiency?.toFixed(1) || '0'}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Cost Savings</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{efficiency.totalSavings?.toFixed(0) || '0'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pesticide Usage</h3>
          <UsageChart data={analytics} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Efficiency Comparison</h3>
          <EfficiencyChart data={efficiency} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Infection Trends</h3>
          <InfectionChart data={trends} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;