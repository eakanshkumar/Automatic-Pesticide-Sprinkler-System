import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  BeakerIcon, 
  ChartBarIcon,
  BellIcon 
} from '@heroicons/react/24/outline';

const Overview = ({ farms, sprayEvents, analytics }) => {
  const totalPesticide = analytics.reduce((sum, item) => sum + (item.metrics?.pesticideUsed || 0), 0);
  const totalArea = analytics.reduce((sum, item) => sum + (item.metrics?.areaSprayed || 0), 0);
  const recentSprays = sprayEvents.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Farm Stats Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <MapPinIcon className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Farms</dt>
              <dd className="text-lg font-medium text-gray-900">{farms.length}</dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <Link to="/farms" className="text-green-600 hover:text-green-800 text-sm font-medium">
            View all farms →
          </Link>
        </div>
      </div>

      {/* Spray Stats Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <BeakerIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Spray Events</dt>
              <dd className="text-lg font-medium text-gray-900">{sprayEvents.length}</dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <Link to="/spray/events" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View spray history →
          </Link>
        </div>
      </div>

      {/* Analytics Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Pesticide Used</dt>
              <dd className="text-lg font-medium text-gray-900">{totalPesticide.toFixed(1)}L</dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <Link to="/analytics" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
            View analytics →
          </Link>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <BellIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Area Covered</dt>
              <dd className="text-lg font-medium text-gray-900">{totalArea.toFixed(1)}ha</dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <Link to="/spray/control" className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
            Control spray →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;