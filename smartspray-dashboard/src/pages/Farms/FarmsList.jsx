import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { farmsService } from '../../services/farms';
import FarmCard from '../../components/farms/FarmCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Modal from '../../components/ui/Modal';
import { toast } from 'react-hot-toast';

const FarmsList = () => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState(null);
  const queryClient = useQueryClient();

  // Fetch farms data
  const {
    data: farmsData,
    isLoading,
    error,
    refetch,
  } = useQuery(['farms'], farmsService.getFarms);

  // Delete farm mutation
  const deleteMutation = useMutation(farmsService.deleteFarm, {
    onSuccess: () => {
      queryClient.invalidateQueries('farms');
      toast.success('Farm deleted successfully');
      setDeleteConfirmOpen(false);
      setFarmToDelete(null);
    },
    onError: (error) => {
      toast.error('Failed to delete farm');
    },
  });

  const handleDeleteClick = (farm) => {
    setFarmToDelete(farm);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (farmToDelete) {
      deleteMutation.mutate(farmToDelete._id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load farms. Please try again."
        onRetry={refetch}
      />
    );
  }

  const farms = farmsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Farms</h1>
        <Link
          to="/farms/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Farm</span>
        </Link>
      </div>

      {farms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏞️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No farms yet</h3>
          <p className="text-gray-500 mb-4">
            Get started by adding your first farm to monitor and manage.
          </p>
          <Link
            to="/farms/create"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Add Your First Farm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <FarmCard
              key={farm._id}
              farm={farm}
              onEdit={() => {}}
              onDelete={() => handleDeleteClick(farm)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Farm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the farm "{farmToDelete?.name}"? This action
            cannot be undone and will remove all associated data.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete Farm'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FarmsList;