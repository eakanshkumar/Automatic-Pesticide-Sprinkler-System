import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  ArrowsPointingOutIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";


const FarmCard = ({ farm, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{farm.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(farm)}
              className="text-blue-600 hover:text-blue-800 p-1"
              aria-label="Edit farm"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(farm)}
              className="text-red-600 hover:text-red-800 p-1"
              aria-label="Delete farm"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>
              {farm.location.address}, {farm.location.city}, {farm.location.state}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <ArrowsPointingOutIcon className="h-5 w-5 mr-2" />
            <span>{farm.size} hectares</span>
          </div>

          {farm.fields && farm.fields.length > 0 && (
            <div className="flex items-center text-gray-600">
              <Squares2X2Icon className="h-5 w-5 mr-2" />
              <span>{farm.fields.length} fields</span>
            </div>
          )}
        </div>

        {farm.crops && farm.crops.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Crops</h4>
            <div className="flex flex-wrap gap-2">
              {farm.crops.map((crop, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            to={`/farms/${farm._id}`}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmCard;