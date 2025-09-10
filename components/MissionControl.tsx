import React from 'react';
import type { WindowState } from '../types';
import { APPS } from '../constants';

interface MissionControlProps {
  windows: WindowState[];
  onSelectWindow: (id: string) => void;
  onClose: () => void;
}

const MissionControl: React.FC<MissionControlProps> = ({ windows, onSelectWindow, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[999] flex items-center justify-center p-8 animate-fade-in"
      onClick={onClose}
    >
      <div className="grid grid-cols-4 gap-6">
        {windows.map(win => {
          const appConfig = APPS.find(app => app.id === win.id);
          const Icon = appConfig?.icon;

          return (
            <div
              key={win.id}
              className="group cursor-pointer bg-black/30 border border-white/20 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWindow(win.id);
              }}
            >
              <div className="p-4 bg-white/10 rounded-t-lg">
                <div className="flex items-center space-x-2">
                  {Icon && <Icon className="w-5 h-5 text-white" />}
                  <span className="text-white text-sm font-semibold truncate">{win.title}</span>
                </div>
              </div>
              <div className="h-32 flex items-center justify-center bg-black/20 rounded-b-lg">
                {Icon && <Icon className="w-16 h-16 text-white/50" />}
              </div>
            </div>
          );
        })}
        {windows.length === 0 && (
            <p className="col-span-4 text-white/70 text-lg text-center">No open windows</p>
        )}
      </div>
    </div>
  );
};

export default MissionControl;
