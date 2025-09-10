import React from 'react';
import type { Notification } from '../types';

interface NotificationCenterProps {
  visible: boolean;
  notifications: Notification[];
  onClear: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ visible, notifications, onClear }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed top-7 right-0 bottom-0 w-80 bg-white/50 dark:bg-black/50 backdrop-blur-2xl z-[55] text-black dark:text-white shadow-lg p-4 space-y-3 overflow-y-auto animate-slide-in-left"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Notifications</h2>
        {notifications.length > 0 && (
          <button onClick={onClear} className="text-xs text-blue-500 hover:underline">Clear All</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          <p>No new notifications</p>
        </div>
      ) : (
        notifications.map(notif => (
          <div key={notif.id} className="bg-white/40 dark:bg-black/40 p-3 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <notif.icon className="w-4 h-4" />
              <span className="text-xs font-semibold">{notif.title}</span>
            </div>
            <p className="text-sm">{notif.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationCenter;