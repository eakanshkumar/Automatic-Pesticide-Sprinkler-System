import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { farmsService } from '../../services/farms';
import FormInput from '../common/FormInput';
import LoadingSpinner from '../ui/LoadingSpinner';

const SprayForm = ({ onSubmit, loading, initialData }) => {
  const { data: farmsData, isLoading: farmsLoading } = useQuery(
    ['farms'],
    farmsService.getFarms
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: initialData || {
      farmId: '',
      field: '',
      pesticideUsed: '',
      areaCovered: '',
      triggeredBy: 'manual',
    },
  });

  const selectedFarmId = watch('farmId');
  const selectedFarm = farmsData?.data?.find(farm => farm._id === selectedFarmId);
  const fields = selectedFarm?.fields || [];

  if (farmsLoading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Farm
        </label>
        <select
          {...register('farmId', { required: 'Farm is required' })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select a farm</option>
          {farmsData?.data?.map((farm) => (
            <option key={farm._id} value={farm._id}>
              {farm.name}
            </option>
          ))}
        </select>
        {errors.farmId && (
          <p className="mt-1 text-sm text-red-600">{errors.farmId.message}</p>
        )}
      </div>

      {selectedFarm && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field
          </label>
          <select
            {...register('field', { required: 'Field is required' })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select a field</option>
            {fields.map((field, index) => (
              <option key={index} value={field.name}>
                {field.name} ({field.size} ha)
              </option>
            ))}
          </select>
          {errors.field && (
            <p className="mt-1 text-sm text-red-600">{errors.field.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Pesticide Used (L)"
          type="number"
          step="0.1"
          {...register('pesticideUsed', {
            required: 'Pesticide amount is required',
            min: { value: 0.1, message: 'Minimum amount is 0.1L' },
          })}
          error={errors.pesticideUsed?.message}
        />

        <FormInput
          label="Area Covered (ha)"
          type="number"
          step="0.1"
          {...register('areaCovered', {
            required: 'Area covered is required',
            min: { value: 0.1, message: 'Minimum area is 0.1ha' },
          })}
          error={errors.areaCovered?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trigger Type
        </label>
        <select
          {...register('triggeredBy')}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="manual">Manual</option>
          <option value="auto">Automatic</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'} Spray Event
        </button>
      </div>
    </form>
  );
};

export default SprayForm;