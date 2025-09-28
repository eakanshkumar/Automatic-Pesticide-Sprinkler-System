import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemService } from '../../services/system';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { toast } from 'react-hot-toast';

const System = () => {
  const [settings, setSettings] = useState({});
  const queryClient = useQueryClient();

  const { data: systemData, isLoading, error } = useQuery(
    ['systemSettings'],
    systemService.getSettings
  );

  const updateMutation = useMutation(systemService.updateSettings, {
    onSuccess: () => {
      toast.success('System settings updated successfully');
      queryClient.invalidateQueries('systemSettings');
    },
    onError: (error) => {
      toast.error('Failed to update system settings');
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load system settings" />;

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync(settings);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Name
            </label>
            <input
              type="text"
              defaultValue={systemData?.data?.systemName || 'कृषिNetra'}
              onChange={(e) => handleSettingChange('systemName', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Spray Threshold (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              defaultValue={systemData?.data?.sprayThreshold || 15}
              onChange={(e) => handleSettingChange('sprayThreshold', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Retention Period (days)
            </label>
            <input
              type="number"
              min="30"
              max="365"
              defaultValue={systemData?.data?.dataRetention || 90}
              onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Automatic Backup
            </label>
            <select
              defaultValue={systemData?.data?.autoBackup ? 'true' : 'false'}
              onChange={(e) => handleSettingChange('autoBackup', e.target.value === 'true')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {updateMutation.isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default System;