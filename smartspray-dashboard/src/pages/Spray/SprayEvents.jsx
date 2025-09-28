import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import SprayEventsList from '../../components/spray/SprayEventsList';

const SprayEvents = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Spray Events</h1>
        <Link
          to="/spray/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Spray Event</span>
        </Link>
      </div>

      <SprayEventsList />
    </div>
  );
};

export default SprayEvents;