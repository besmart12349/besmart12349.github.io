import React from 'react';
import { SunIcon, MoonIcon } from '../components/Icons';

interface SettingsProps {
  onWallpaperSelect: (url: string) => void;
  wallpapers: string[];
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onWallpaperSelect, wallpapers, theme, onThemeToggle }) => {
  return (
    <div className="w-full h-full bg-gray-100/80 backdrop-blur-xl p-4 overflow-y-auto dark:bg-gray-900/80 dark:text-white">
      <h1 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-100">Settings</h1>
      
      <div className="mb-6">
        <h2 className="text-md font-semibold text-gray-700 mb-2 dark:text-gray-300">Appearance</h2>
        <div className="bg-gray-200/80 p-3 rounded-lg dark:bg-gray-800/80 flex justify-between items-center">
          <span className="font-medium">Theme</span>
          <button onClick={onThemeToggle} className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-1 rounded-full shadow-inner">
            <span className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}><SunIcon className="w-4 h-4" /></span>
            <span className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}><MoonIcon className="w-4 h-4" /></span>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-md font-semibold text-gray-700 mb-2 dark:text-gray-300">Change Wallpaper</h2>
        <div className="grid grid-cols-3 gap-4">
          {wallpapers.map((url, index) => (
            <div
              key={index}
              className="aspect-video bg-cover bg-center rounded-lg cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all"
              style={{ backgroundImage: `url(${url})` }}
              onClick={() => onWallpaperSelect(url)}
              title={`Set Wallpaper ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;