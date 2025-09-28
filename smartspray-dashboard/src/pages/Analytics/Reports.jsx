import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyticsService } from '../../services/analytics';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Reports = () => {
  const [reportData, setReportData] = useState({
    startDate: '',
    endDate: '',
    reportType: 'summary',
  });

  const generateReportMutation = useMutation(analyticsService.generateReport, {
    onSuccess: (data) => {
      toast.success('Report generated successfully');
      // Handle report data display
      console.log('Report data:', data);
    },
    onError: (error) => {
      toast.error('Failed to generate report');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateReportMutation.mutateAsync(reportData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Reports</h1>
        <p className="text-gray-600">Create custom reports for your spraying operations</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={reportData.startDate}
                onChange={(e) => setReportData(prev => ({ ...prev, startDate: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={reportData.endDate}
                onChange={(e) => setReportData(prev => ({ ...prev, endDate: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={reportData.reportType}
              onChange={(e) => setReportData(prev => ({ ...prev, reportType: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="efficiency">Efficiency Report</option>
              <option value="financial">Financial Report</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={generateReportMutation.isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {generateReportMutation.isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>
      </div>

      {generateReportMutation.isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Generating report...</span>
          </div>
        </div>
      )}

      {generateReportMutation.data && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Report Results</h3>
          {/* Display report data here */}
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(generateReportMutation.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Reports;