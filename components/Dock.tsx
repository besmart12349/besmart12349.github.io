import React, { useState, useRef } from 'react';
import type { AppID, WindowState, AppConfig } from '../types';

interface DockProps {
  apps: AppConfig[];
  setApps: React.Dispatch<React.SetStateAction<AppConfig[]>>;
  onAppClick: (id: AppID) => void;
  onLaunchpadClick: () => void;
  windows: WindowState[];
}

const Dock: React.FC<DockProps> = ({ apps, setApps, onAppClick, onLaunchpadClick, windows }) => {
  const [bouncingApp, setBouncingApp] = useState<AppID | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleAppClick = (app: AppConfig) => {
    if (app.id === 'launchpad') {
      onLaunchpadClick();
    } else {
      onAppClick(app.id);
    }
    setBouncingApp(app.id);
    setTimeout(() => setBouncingApp(null), 500); // Animation duration
  };

  const isOpen = (id: AppID) => windows.some(win => win.id === id);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newApps = [...apps];
      const draggedItemContent = newApps.splice(dragItem.current, 1)[0];
      newApps.splice(dragOverItem.current, 0, draggedItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setApps(newApps);
    }
  };


  return (
    <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end h-20 p-2 space-x-2 bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:bg-black/20 dark:border-white/20">
        {apps.map((app, index) => (
          <div 
            key={app.id} 
            className="group relative flex flex-col items-center" 
            onClick={() => handleAppClick(app)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
             <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-black/70 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {app.title}
            </span>
            <button className={`w-14 h-14 p-1 transition-transform duration-200 ease-in-out group-hover:-translate-y-2 group-hover:scale-110 ${bouncingApp === app.id ? 'animate-bounce' : ''}`}>
              <app.icon className="w-full h-full" />
            </button>
            {app.id !== 'launchpad' && (
              <div className={`w-1.5 h-1.5 mt-1 rounded-full bg-gray-800/70 dark:bg-white/70 transition-opacity duration-300 ${isOpen(app.id) ? 'opacity-100' : 'opacity-0'}`} />
            )}
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Dock;