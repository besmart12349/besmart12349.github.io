import React from 'react';
import { useDraggable } from '../hooks/useDraggable';

interface ApiMonitorWidgetProps {
  apiCallCount: number;
  limit: number;
  initialPosition: { x: number; y: number };
}

const ApiMonitorWidget: React.FC<ApiMonitorWidgetProps> = ({ apiCallCount, limit, initialPosition }) => {
  const { position, dragRef, onMouseDown } = useDraggable(initialPosition);

  const remaining = Math.max(0, limit - apiCallCount);
  const percentage = limit > 0 ? Math.min(100, (apiCallCount / limit) * 100) : 0;

  return (
    <div
      ref={dragRef}
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        userSelect: 'none',
        zIndex: 5, // Above desktop bg, below icons and windows
      }}
      className="w-48 p-3 bg-black/40 backdrop-blur-md rounded-lg shadow-lg cursor-grab active:cursor-grabbing text-white flex flex-col space-y-2"
    >
      <div className="flex items-center space-x-2 text-sm font-bold border-b border-white/20 pb-2">
        <span>API Monitor</span>
      </div>
      <div className="text-xs">
        <div className="flex justify-between">
          <span>Calls Made:</span>
          <span className="font-mono">{apiCallCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Est. Remaining:</span>
          <span className="font-mono">{remaining}</span>
        </div>
      </div>
      <div className="w-full bg-white/20 rounded-full h-1.5">
        <div 
          className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ApiMonitorWidget;
