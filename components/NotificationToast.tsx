import React from 'react';
import type { Notification } from '../types';

interface NotificationToastProps {
  notification: Notification;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification }) => {
  const { icon: Icon, title, message } = notification;

  return (
    <div className="w-80 bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-2xl shadow-lg p-4 animate-slide-in-down">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 flex-shrink-0">
            <Icon className="w-full h-full" />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-sm text-black dark:text-white">{title}</h3>
          <p className="text-sm text-gray-800 dark:text-gray-200">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;