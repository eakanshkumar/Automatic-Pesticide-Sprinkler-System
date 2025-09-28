import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="text-sm text-gray-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              {user.phone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900">{user.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="text-sm text-gray-900 capitalize">{user.role}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Farm Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Farm Name</dt>
                <dd className="text-sm text-gray-900">{user.farmName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Farm Size</dt>
                <dd className="text-sm text-gray-900">{user.farmSize} hectares</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Subscription</dt>
                <dd className="text-sm text-gray-900">{user.subscription}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {user.crops && user.crops.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Crops Grown</h3>
            <div className="flex flex-wrap gap-2">
              {user.crops.map((crop, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href="/settings"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Edit Profile →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;