import React, { useState, useEffect } from 'react';
import type { AppID, AppConfig } from '../types';
import { SearchIcon } from './Icons';

interface SpotlightProps {
  onClose: () => void;
  onAppSelect: (id: AppID) => void;
  allApps: AppConfig[];
}

const Spotlight: React.FC<SpotlightProps> = ({ onClose, onAppSelect, allApps }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredApps = allApps.filter(app => 
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) && (app.component || app.externalUrl)
  );
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Enter' && filteredApps.length > 0) {
        onAppSelect(filteredApps[0].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onAppSelect, filteredApps]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" onClick={onClose}>
      <div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-black/10 dark:border-white/10 p-2">
            <SearchIcon className="w-6 h-6 text-gray-500 mx-2"/>
            <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Spotlight Search"
            className="w-full bg-transparent text-xl focus:outline-none text-black dark:text-white"
            autoFocus
            />
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {filteredApps.map(app => (
            <li 
              key={app.id}
              onClick={() => onAppSelect(app.id)}
              className="flex items-center space-x-4 p-2.5 hover:bg-blue-500 hover:text-white cursor-pointer text-black dark:text-white"
            >
              <app.icon className="w-8 h-8"/>
              <span className="text-lg">{app.title}</span>
            </li>
          ))}
          {filteredApps.length === 0 && searchTerm && (
              <li className="p-4 text-center text-gray-500">No results for "{searchTerm}"</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Spotlight;