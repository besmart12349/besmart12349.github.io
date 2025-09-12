import React, { useState, useRef } from 'react';
import type { AppID, WindowState, AppConfig } from '../types';
import { LockIcon } from './Icons';

interface DockProps {
  apps: AppConfig[];
  setApps: React.Dispatch<React.SetStateAction<AppConfig[]>>;
  onAppClick: (id: AppID) => void;
  onLaunchpadClick: () => void;
  windows: WindowState[];
  lockedApps: AppID[];
  onToggleLock: (id: AppID) => void;
}

const Dock: React.FC<DockProps> = ({ apps, setApps, onAppClick, onLaunchpadClick, windows, lockedApps, onToggleLock }) => {
  const [bouncingApp, setBouncingApp] = useState<AppID | null>(null);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; appId: AppID | null }>({ visible: false, x: 0, y: 0, appId: null });
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
  
  const handleContextMenu = (e: React.MouseEvent, appId: AppID) => {
    e.preventDefault();
    if (appId === 'launchpad' || appId === 'finder') return; // Cannot lock these
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY - 10, appId });
  }

  const closeContextMenu = () => {
    if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, appId: null });
    }
  };

  React.useEffect(() => {
      document.addEventListener('click', closeContextMenu);
      return () => document.removeEventListener('click', closeContextMenu);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextMenu.visible]);

  const isOpen = (id: AppID) => windows.some(win => win.id === id);
  const isLocked = (id: AppID) => lockedApps.includes(id);

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
    <>
    <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end h-20 p-2 space-x-2 bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:bg-black/20 dark:border-white/20">
        {apps.map((app, index) => (
          <div 
            key={app.id} 
            className="group relative flex flex-col items-center" 
            onClick={() => handleAppClick(app)}
            onContextMenu={(e) => handleContextMenu(e, app.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
             <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-black/70 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {app.title}
            </span>
            <button className={`relative w-14 h-14 p-1 transition-transform duration-200 ease-in-out group-hover:-translate-y-2 group-hover:scale-110 ${bouncingApp === app.id ? 'animate-bounce' : ''}`}>
              <app.icon className="w-full h-full" />
              {isLocked(app.id) && (
                  <div className="absolute bottom-0 right-0 p-0.5 bg-black/50 rounded-full">
                    <LockIcon className="w-3 h-3 text-white" />
                  </div>
              )}
            </button>
            {app.id !== 'launchpad' && (
              <div className={`w-1.5 h-1.5 mt-1 rounded-full bg-gray-800/70 dark:bg-white/70 transition-opacity duration-300 ${isOpen(app.id) ? 'opacity-100' : 'opacity-0'}`} />
            )}
          </div>
        ))}
      </div>
    </footer>
    {contextMenu.visible && contextMenu.appId && (
        <div 
            className="fixed bg-white/60 backdrop-blur-xl rounded-md shadow-lg border border-white/50 py-1 z-[60] dark:bg-gray-800/60 dark:border-gray-700/50"
            style={{ top: contextMenu.y, left: contextMenu.x, transform: 'translateY(-100%)' }}
        >
            <button
                onClick={() => {
                    onToggleLock(contextMenu.appId!);
                    closeContextMenu();
                }}
                className="block w-full text-left px-4 py-1.5 text-sm text-black hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-blue-500"
            >
                {isLocked(contextMenu.appId) ? 'Unlock App' : 'Lock App'}
            </button>
        </div>
    )}
    </>
  );
};

export default Dock;