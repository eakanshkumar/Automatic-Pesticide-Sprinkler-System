import React from 'react';
import NotificationList from '../../components/notifications/NotificationList';

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">Manage your alerts and notifications</p>
      </div>

      <NotificationList />
    </div>
  );
};

export default Notifications;