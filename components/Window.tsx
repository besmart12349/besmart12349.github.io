import React, { useState, useEffect } from 'react';
import { useDraggable } from '../hooks/useDraggable';

interface WindowProps {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
  isActive: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  position,
  size,
  zIndex,
  isActive,
  isMinimized,
  isMaximized,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  children,
}) => {
  const { position: currentPosition, dragRef, onMouseDown } = useDraggable(position, onFocus);
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 200); // Animation duration
    return () => clearTimeout(timer);
  }, []);

  const activeClasses = isActive
    ? 'shadow-2xl border-gray-400/50 dark:border-gray-500/50'
    : 'shadow-lg border-gray-500/30 dark:border-gray-700/30';
  
  const openingClasses = isOpening
    ? 'opacity-0 scale-95'
    : 'opacity-100 scale-100';

  const windowStyles: React.CSSProperties = isMaximized
    ? {
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex,
        transition: 'width 0.2s, height 0.2s, top 0.2s, left 0.2s',
      }
    : {
        top: currentPosition.y,
        left: currentPosition.x,
        width: size.width,
        height: size.height,
        zIndex,
        transition: isOpening ? 'opacity 0.2s, transform 0.2s' : 'none',
      };

  return (
    <div
      ref={dragRef}
      className={`fixed flex flex-col bg-gray-200/80 backdrop-blur-xl border rounded-lg overflow-hidden ${activeClasses} ${openingClasses} ${isMinimized ? 'hidden' : ''} ${isMaximized ? 'rounded-none' : 'rounded-lg'} dark:bg-gray-800/80 dark:text-white`}
      style={windowStyles}
      onMouseDown={onFocus}
    >
      <header
        className={`flex items-center justify-between h-8 border-b px-2 select-none flex-shrink-0 ${isActive ? 'bg-gray-100/70 dark:bg-gray-700/70' : 'bg-gray-50/70 dark:bg-gray-700/50'} border-gray-300/50 dark:border-gray-600/50`}
        onMouseDown={!isMaximized ? onMouseDown : undefined}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center space-x-2">
          <button
            className="w-3.5 h-3.5 bg-red-500 rounded-full border border-red-600/50 flex items-center justify-center group"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          ><span className="hidden group-hover:block text-red-900 font-bold text-xs">×</span></button>
          <button
            className="w-3.5 h-3.5 bg-yellow-500 rounded-full border border-yellow-600/50 flex items-center justify-center group"
            onClick={(e) => {
                e.stopPropagation();
                onMinimize();
            }}
          ><span className="hidden group-hover:block text-yellow-900 font-bold text-xs">−</span></button>
          <button
            className="w-3.5 h-3.5 bg-green-500 rounded-full border border-green-600/50 flex items-center justify-center group"
            onClick={(e) => {
                e.stopPropagation();
                onMaximize();
            }}
          ><span className="hidden group-hover:block text-green-900 font-bold text-xs">⤢</span></button>
        </div>
        <span className={`text-sm font-medium truncate ${isActive ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>{title}</span>
        <div className="w-16"></div>
      </header>
      <main className="flex-grow overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Window;