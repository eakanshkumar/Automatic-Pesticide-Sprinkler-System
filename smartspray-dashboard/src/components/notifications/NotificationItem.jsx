import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatRelativeTime } from '../../utils/helpers';

const NotificationItem = ({ notification, compact = false }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return '⚠️';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '🔔';
    }
  };

  const handleMarkAsRead = () => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
  };

  if (compact) {
    return (
      <div
        className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
          !notification.read ? 'bg-blue-50' : ''
        }`}
        onClick={handleMarkAsRead}
      >
        <div className="flex items-start space-x-3">
          <span className="text-lg">{getIcon(notification.type)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {notification.title}
            </p>
            <p className="text-sm text-gray-600 truncate">
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatRelativeTime(notification.createdAt)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 border border-gray-200 rounded-lg ${
        !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-xl mt-1">{getIcon(notification.type)}</span>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {formatRelativeTime(notification.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!notification.read && (
            <button
              onClick={() => markAsRead(notification._id)}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Mark read
            </button>
          )}
          <button
            onClick={() => deleteNotification(notification._id)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;