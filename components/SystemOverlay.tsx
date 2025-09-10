import React, { useEffect } from 'react';
import { MacetaraLogo, SleepIcon } from './Icons';

interface SystemOverlayProps {
  action: 'restart' | 'shutdown' | 'sleep';
  onWakeUp: () => void;
}

const SystemOverlay: React.FC<SystemOverlayProps> = ({ action, onWakeUp }) => {
  useEffect(() => {
    if (action === 'restart') {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [action]);

  const getMessage = () => {
    switch (action) {
      case 'restart': return 'Restarting...';
      case 'shutdown': return 'Shutting Down...';
      case 'sleep': return 'Sleeping...';
    }
  };

  const getIcon = () => {
    switch (action) {
      case 'sleep':
        return <SleepIcon className="w-24 h-24 mb-8 text-blue-300" />;
      default:
        return <MacetaraLogo className="w-24 h-24 mb-8 animate-pulse" />;
    }
  }

  const handleClick = () => {
    if (action === 'sleep') {
      onWakeUp();
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white"
      onClick={handleClick}
    >
      {getIcon()}
      <p className="text-2xl">{getMessage()}</p>
      {action === 'sleep' && <p className="text-sm mt-4 text-gray-400">Click anywhere to wake up</p>}
    </div>
  );
};

export default SystemOverlay;