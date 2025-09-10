import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  onItemClick: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, visible, onClose, onItemClick }) => {
  if (!visible) return null;

  const handleClick = () => {
    onItemClick();
    onClose();
  };

  return (
    <div
      className="fixed bg-white/60 backdrop-blur-xl rounded-md shadow-lg border border-white/50 py-1 z-[60] dark:bg-gray-800/60 dark:border-gray-700/50"
      style={{ top: y, left: x }}
    >
      <button
        onClick={handleClick}
        className="block w-full text-left px-4 py-1.5 text-sm text-black hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-blue-500"
      >
        Change Background...
      </button>
    </div>
  );
};

export default ContextMenu;