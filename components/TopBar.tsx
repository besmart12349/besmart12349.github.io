
import React, { useState, useEffect, useRef } from 'react';
import { MacetaraLogo, HoustonIcon, GridIcon, SearchIcon, ControlCenterIcon, DownloadIcon } from './Icons';

interface TopBarProps {
  activeAppName: string;
  onAboutClick: () => void;
  onRestart: () => void;
  onShutdown: () => void;
  onSleep: () => void;
  onLogOut: () => void;
  onHoustonClick: () => void;
  onMissionControlToggle: () => void;
  onSpotlightToggle: () => void;
  onControlCenterToggle: () => void;
  onNotificationCenterToggle: () => void;
  isInstallable: boolean;
  onInstallClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  activeAppName, 
  onAboutClick, 
  onRestart, 
  onShutdown, 
  onSleep, 
  onLogOut,
  onHoustonClick,
  onMissionControlToggle,
  onSpotlightToggle,
  onControlCenterToggle,
  onNotificationCenterToggle,
  isInstallable,
  onInstallClick,
}) => {
  const [time, setTime] = useState(new Date());
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-7 bg-white/30 backdrop-blur-xl z-50 flex items-center justify-between px-4 text-sm text-black shadow-sm dark:bg-black/30 dark:text-white">
      <div className="flex items-center space-x-4">
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(prev => !prev)} className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <MacetaraLogo className="h-5 w-5" />
          </button>
          {isMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white/80 backdrop-blur-xl rounded-md shadow-lg border border-white/50 py-1 dark:bg-gray-800/80 dark:border-gray-700/50">
              <button onClick={() => { onAboutClick(); setMenuOpen(false); }} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">About ArsisOS</button>
              <div className="my-1 h-px bg-gray-400/30 dark:bg-gray-600/30"></div>
              <button onClick={() => { onSleep(); setMenuOpen(false); }} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">Sleep</button>
              <button onClick={() => { onRestart(); setMenuOpen(false); }} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">Restart...</button>
              <button onClick={() => { onShutdown(); setMenuOpen(false); }} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">Shut Down...</button>
              <div className="my-1 h-px bg-gray-400/30 dark:bg-gray-600/30"></div>
              <button onClick={() => { onLogOut(); setMenuOpen(false); }} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">Log Out</button>
            </div>
          )}
        </div>
        <span className="font-bold">{activeAppName}</span>
      </div>
      <div className="flex items-center space-x-4">
        {isInstallable && (
          <button onClick={onInstallClick} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Install ArsisOS">
            <DownloadIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </button>
        )}
        <button onClick={onHoustonClick} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Open Houston AI">
          <HoustonIcon className="h-5 w-5" />
        </button>
        <button onClick={onMissionControlToggle} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Mission Control">
          <GridIcon className="h-5 w-5" />
        </button>
        <button onClick={onSpotlightToggle} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Spotlight Search">
          <SearchIcon className="h-5 w-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onControlCenterToggle(); }} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Control Center">
          <ControlCenterIcon className="h-5 w-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onNotificationCenterToggle(); }} className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10" title="Notification Center">
          <span>{formatDate(time)} {formatTime(time)}</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
