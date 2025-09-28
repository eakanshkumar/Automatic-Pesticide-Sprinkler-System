import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sprayService } from '../../services/spray';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';

const SprayEventsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    data: sprayData,
    isLoading,
    error,
  } = useQuery(
    ['sprayEvents', page, search, statusFilter],
    () => sprayService.getSprayEvents({
      page,
      limit: 10,
      search,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    })
  );

  const sprayEvents = sprayData?.data?.items || [];
  const totalPages = sprayData?.data?.totalPages || 1;

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load spray events" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search spray events..."
          className="flex-1"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {sprayEvents.map((event) => (
            <li key={event._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {event.farm?.name} - {event.field}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.startTime).toLocaleDateString()} • 
                        {event.duration && ` ${event.duration} min`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'completed' ? 'bg-green-100 text-green-800' :
                      event.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                    <p className="text-sm text-gray-900 mt-1">
                      {event.pesticideUsed}L • {event.areaCovered}ha
                    </p>
                  </div>
                </div>
                
                {event.infectionData && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Infection: {event.infectionData.preSprayInfectionRate}% • 
                      Severity: {event.infectionData.severity}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default SprayEventsList;