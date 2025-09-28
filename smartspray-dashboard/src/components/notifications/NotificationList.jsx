import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

const NotificationList = () => {
  const { notifications, isLoading, markAllAsRead } = useNotifications();

  if (isLoading) return <LoadingSpinner />;

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
        {unreadNotifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <>
          {unreadNotifications.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Unread</h3>
              <div className="space-y-2">
                {unreadNotifications.map(notification => (
                  <NotificationItem key={notification._id} notification={notification} />
                ))}
              </div>
            </div>
          )}

          {readNotifications.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Read</h3>
              <div className="space-y-2">
                {readNotifications.map(notification => (
                  <NotificationItem key={notification._id} notification={notification} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationList;