import React from 'react';
import type { AppID, AppConfig } from '../types';
import { EXTERNAL_APPS } from '../constants';

interface AppStoreProps {
  installedApps: AppID[];
  onInstall: (appId: AppID) => void;
  onOpen: (appId: AppID) => void;
}

const AppStore: React.FC<AppStoreProps> = ({ installedApps, onInstall, onOpen }) => {
  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 overflow-y-auto">
      <header className="pb-4 border-b border-gray-300 dark:border-gray-700 mb-6">
        <h1 className="text-3xl font-bold">App Store</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover and install new web applications for ArsisOS.</p>
      </header>
      
      <div className="space-y-4">
        {EXTERNAL_APPS.map((app) => {
          const isInstalled = installedApps.includes(app.id);
          return (
            <div key={app.id} className="flex items-center bg-white dark:bg-gray-900/50 p-4 rounded-lg shadow-sm">
              <div className="w-16 h-16 mr-4 flex-shrink-0">
                  <app.icon className="w-full h-full" />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{app.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{app.description}</p>
              </div>
              <button
                onClick={() => (isInstalled ? onOpen(app.id) : onInstall(app.id))}
                className={`ml-4 px-5 py-2 text-sm font-semibold rounded-full transition-colors w-28 text-center ${
                  isInstalled
                    ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {isInstalled ? 'Open' : 'Install'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppStore;
