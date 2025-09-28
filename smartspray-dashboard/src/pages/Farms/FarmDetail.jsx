import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { farmsService } from '../../services/farms';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { MapPinIcon, ArrowsPointingOutIcon, TagIcon } from '@heroicons/react/24/outline';

const FarmDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery(['farm', id], () =>
    farmsService.getFarm(id)
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load farm details" />;

  const farm = data?data:"NO FARM DATA";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{farm.name}</h1>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPinIcon className="h-5 w-5 mr-1" />
            <span>
              {farm.location.address && `${farm.location.address}, `}
              {farm.location.city && `${farm.location.city}, `}
              {farm.location.state && `${farm.location.state}, `}
              {farm.location.country}
            </span>
          </div>
        </div>
        <Link
          to={`/farms/edit/${farm._id}`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Edit Farm
        </Link>
      </div>

      {/* Farm Details Grid */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Farm Size */}
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <ArrowsPointingOutIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Farm Size</h2>
                <p className="text-xl font-semibold">{farm.size} hectares</p>
              </div>
            </div>

            {/* Crops Grown */}
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <TagIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Crops Grown</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  {farm.crops && farm.crops.length > 0 ? (
                    farm.crops.map((crop, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {crop}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No crops specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="text-gray-900">{farm.location.address || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">City</h3>
                <p className="text-gray-900">{farm.location.city || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">State/Province</h3>
                <p className="text-gray-900">{farm.location.state || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Country</h3>
                <p className="text-gray-900">{farm.location.country || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Map</h2>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Map would be displayed here if location coordinates were available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <Link
          to="/farms"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Farms
        </Link>
      </div>
    </div>
  );
};

export default FarmDetail;