import React, { useEffect } from 'react';
import type { AppID, AppConfig } from '../types';

interface LaunchpadProps {
  onClose: () => void;
  onAppSelect: (id: AppID) => void;
  wallpaperUrl: string;
  allApps: AppConfig[];
}

const Launchpad: React.FC<LaunchpadProps> = ({ onClose, onAppSelect, wallpaperUrl, allApps }) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const appsToShow = allApps.filter(app => (app.component || app.externalUrl)); // Only show apps that can be opened

  return (
    <div 
      className="fixed inset-0 z-[99] animate-fade-in"
      onClick={onClose}
    >
        <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${wallpaperUrl})`, filter: 'blur(20px)'}}
        />
        <div className="absolute inset-0 bg-black/20" />

      <div className="relative w-full h-full p-16 grid grid-cols-8 gap-y-8 gap-x-4">
        {appsToShow.map(app => (
          <div 
            key={app.id}
            onClick={() => onAppSelect(app.id)}
            className="flex flex-col items-center space-y-2 text-white cursor-pointer group"
          >
            <div className="w-20 h-20 transition-transform duration-100 group-hover:scale-110">
                <app.icon className="w-full h-full drop-shadow-lg" />
            </div>
            <span className="text-sm font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              {app.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Launchpad;