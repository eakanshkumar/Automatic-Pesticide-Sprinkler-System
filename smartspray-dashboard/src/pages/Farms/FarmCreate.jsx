import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { farmsService } from '../../services/farms';
import FarmForm from '../../components/farms/FarmForm';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FarmCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation(farmsService.createFarm, {
    onSuccess: () => {
      toast.success('Farm created successfully');
      queryClient.invalidateQueries('farms');
      navigate('/farms');
    },
    onError: (error) => {
      toast.error('Failed to create farm');
    },
  });

  const handleSubmit = async (farmData) => {
    await createMutation.mutateAsync(farmData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Farm</h1>
        <p className="text-gray-600">Add a new farm to your कृषिNetra dashboard</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <FarmForm
          onSubmit={handleSubmit}
          loading={createMutation.isLoading}
        />
      </div>
    </div>
  );
};

export default FarmCreate;