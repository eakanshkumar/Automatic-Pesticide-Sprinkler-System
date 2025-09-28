import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmsService } from '../../services/farms';
import { sprayService } from '../../services/spray';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { toast } from 'react-hot-toast';

const SprayControl = () => {
  const [selectedFarm, setSelectedFarm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [pesticideAmount, setPesticideAmount] = useState('');
  
  const queryClient = useQueryClient();

  const { data: farmsData, isLoading: farmsLoading } = useQuery(
    ['farms'],
    farmsService.getFarms
  );

  const sprayMutation = useMutation(sprayService.manualSpray, {
    onSuccess: () => {
      toast.success('Spray command sent successfully');
      queryClient.invalidateQueries('sprayEvents');
      setPesticideAmount('');
    },
    onError: (error) => {
      toast.error('Failed to send spray command');
    },
  });

  const farms = farmsData?.data || [];
  const selectedFarmData = farms.find(farm => farm._id === selectedFarm);
  const fields = selectedFarmData?.fields || [];

  const handleSpray = () => {
    if (!selectedFarm || !selectedField || !pesticideAmount) {
      toast.error('Please fill all fields');
      return;
    }

    sprayMutation.mutate({
      farmId: selectedFarm,
      field: selectedField,
      pesticideAmount: parseFloat(pesticideAmount),
    });
  };

  if (farmsLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Manual Spray Control</h2>
        
        <div className="space-y-4">
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
              Pesticide Amount (Liters)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={pesticideAmount}
              onChange={(e) => setPesticideAmount(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter amount"
            />
          </div>

          <button
            onClick={handleSpray}
            disabled={sprayMutation.isLoading || !selectedFarm || !selectedField || !pesticideAmount}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
          >
            {sprayMutation.isLoading ? 'Spraying...' : 'Start Spraying'}
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Warning:</strong> Manual spraying should only be performed by trained personnel. 
              Ensure proper safety measures are in place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprayControl;