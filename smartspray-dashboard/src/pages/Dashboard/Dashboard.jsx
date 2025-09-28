import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { farmsService } from '../../services/farms';
import { sprayService } from '../../services/spray';
import { analyticsService } from '../../services/analytics';
import FarmMap from '../../components/farms/FarmMap';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Overview from './Overview';

const Dashboard = () => {
  // Fetch farms data
  const {
    data: farmsData,
    isLoading: farmsLoading,
    error: farmsError,
  } = useQuery(['farms'], farmsService.getFarms, {
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch spray events
  const {
    data: sprayEventsData,
    isLoading: sprayEventsLoading,
    error: sprayEventsError,
  } = useQuery(['sprayEvents'], sprayService.getSprayEvents, {
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  // Fetch analytics
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery(['analytics'], analyticsService.getAnalytics, {
    refetchInterval: 60000, // Refetch every minute
  });

  if (farmsLoading || sprayEventsLoading || analyticsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (farmsError || sprayEventsError || analyticsError) {
    return (
      <ErrorMessage
        message="Failed to load dashboard data. Please try again."
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Overview Cards */}
      <Overview
        farms={farmsData?.data || []}
        sprayEvents={sprayEventsData?.data || []}
        analytics={analyticsData?.data || []}
      />

      {/* Farm Map */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Farm Overview</h2>
        <div className="h-96">
          <FarmMap farms={farmsData?.data || []} />
        </div>
      </div>

      {/* Recent Spray Events */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Spray Events</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pesticide Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sprayEventsData?.data.slice(0, 5).map((event) => (
                <tr key={event._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.farm?.name || 'Unknown Farm'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.field}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.pesticideUsed} L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.startTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;