import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyticsService } from '../../services/analytics';
import { toast } from 'react-hot-toast';

const Export = () => {
  const [exportData, setExportData] = useState({
    format: 'csv',
    startDate: '',
    endDate: '',
    dataType: 'spray-events',
  });

  const exportMutation = useMutation(analyticsService.exportData, {
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `smartspray-export-${new Date().toISOString().split('T')[0]}.${exportData.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Export completed successfully');
    },
    onError: (error) => {
      toast.error('Failed to export data');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await exportMutation.mutateAsync(exportData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
        <p className="text-gray-600">Export your spraying data for external analysis</p>
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
                value={exportData.startDate}
                onChange={(e) => setExportData(prev => ({ ...prev, startDate: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={exportData.endDate}
                onChange={(e) => setExportData(prev => ({ ...prev, endDate: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Type
            </label>
            <select
              value={exportData.dataType}
              onChange={(e) => setExportData(prev => ({ ...prev, dataType: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="spray-events">Spray Events</option>
              <option value="analytics">Analytics</option>
              <option value="farms">Farms Data</option>
              <option value="all">All Data</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={exportData.format}
              onChange={(e) => setExportData(prev => ({ ...prev, format: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="excel">Excel</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={exportMutation.isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {exportMutation.isLoading ? 'Exporting...' : 'Export Data'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Export;