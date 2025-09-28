import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmsService } from '../../services/farms';
import { sprayService } from '../../services/spray';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { toast } from 'react-hot-toast';

const Schedule = () => {
  const [selectedFarm, setSelectedFarm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [schedule, setSchedule] = useState({
    time: '',
    days: [],
    pesticideAmount: '',
  });

  const queryClient = useQueryClient();

  const { data: farmsData, isLoading: farmsLoading } = useQuery(
    ['farms'],
    farmsService.getFarms
  );

  const scheduleMutation = useMutation(sprayService.scheduleSpray, {
    onSuccess: () => {
      toast.success('Spray schedule created successfully');
      queryClient.invalidateQueries('sprayEvents');
      setSchedule({ time: '', days: [], pesticideAmount: '' });
    },
    onError: (error) => {
      toast.error('Failed to create spray schedule');
    },
  });

  const farms = farmsData?.data || [];
  const selectedFarmData = farms.find(farm => farm._id === selectedFarm);
  const fields = selectedFarmData?.fields || [];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayToggle = (day) => {
    setSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFarm || !selectedField || !schedule.time || schedule.days.length === 0 || !schedule.pesticideAmount) {
      toast.error('Please fill all fields');
      return;
    }

    await scheduleMutation.mutateAsync({
      farmId: selectedFarm,
      field: selectedField,
      time: schedule.time,
      days: schedule.days,
      pesticideAmount: parseFloat(schedule.pesticideAmount),
    });
  };

  if (farmsLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule Spray</h1>
        <p className="text-gray-600">Schedule automatic spraying for your fields</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Farm
            </label>
            <select
              value={selectedFarm}
              onChange={(e) => {
                setSelectedFarm(e.target.value);
                setSelectedField('');
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Choose a farm</option>
              {farms.map((farm) => (
                <option key={farm._id} value={farm._id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </div>

          {selectedFarm && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Field
              </label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Choose a field</option>
                {fields.map((field, index) => (
                  <option key={index} value={field.name}>
                    {field.name} ({field.size} ha)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time of Day
            </label>
            <input
              type="time"
              value={schedule.time}
              onChange={(e) => setSchedule(prev => ({ ...prev, time: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days of Week
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={schedule.days.includes(day)}
                    onChange={() => handleDayToggle(day)}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesticide Amount (Liters)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={schedule.pesticideAmount}
              onChange={(e) => setSchedule(prev => ({ ...prev, pesticideAmount: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter amount"
              required
            />
          </div>

          <button
            type="submit"
            disabled={scheduleMutation.isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
          >
            {scheduleMutation.isLoading ? 'Scheduling...' : 'Create Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Schedule;