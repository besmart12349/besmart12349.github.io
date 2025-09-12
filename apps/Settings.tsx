
import React, { useRef } from 'react';
import { SunIcon, MoonIcon } from '../components/Icons';

interface SettingsProps {
  onWallpaperSelect: (url: string) => void;
  wallpapers: string[];
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onWallpaperSelect, wallpapers, theme, onThemeToggle }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onWallpaperSelect(result);
      }
    };
    reader.readAsDataURL(file);
  };

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
           <div
            className="aspect-video bg-gray-200/80 dark:bg-gray-800/80 rounded-lg cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all flex items-center justify-center flex-col"
            onClick={handleUploadClick}
            title="Upload Wallpaper"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Upload</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;