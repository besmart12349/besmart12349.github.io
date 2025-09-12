


import React from 'react';
import type { AppID } from '../types';
import { useDraggable } from '../hooks/useDraggable';

interface DesktopIconProps {
  id: AppID;
  title: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  onOpen: () => void;
  initialPosition: { x: number, y: number };
  onPositionChange: (position: { x: number, y: number }) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ id, title, IconComponent, onOpen, initialPosition, onPositionChange, onContextMenu }) => {
  const { position, dragRef, onMouseDown } = useDraggable(initialPosition, undefined, onPositionChange, 80);
  
  return (
    <div
      ref={dragRef}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        userSelect: 'none',
      }}
      className="flex flex-col items-center space-y-1 cursor-pointer group w-20 text-center"
      onMouseDown={onMouseDown}
      onDoubleClick={onOpen}
      onContextMenu={onContextMenu}
    >
      <div className="w-16 h-16 p-1 rounded-lg group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors flex items-center justify-center">
        <IconComponent className="w-12 h-12 drop-shadow-lg" />
      </div>
      <span className="text-white text-sm font-medium bg-black/20 rounded-md px-2 py-0.5 max-w-full truncate" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
        {title}
      </span>
    </div>
  );
};

export default DesktopIcon;