import React from 'react';

export type ContextMenuItem = {
  label: string;
  action: () => void;
  disabled?: boolean;
} | { type: 'divider' };

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, visible, items, onClose }) => {
  if (!visible) return null;

  const handleItemClick = (item: ContextMenuItem) => {
    if ('action' in item && !item.disabled) {
      item.action();
    }
    onClose();
  };

  return (
    <div
      className="fixed bg-white/60 backdrop-blur-xl rounded-md shadow-lg border border-white/50 py-1 z-[60] dark:bg-gray-800/60 dark:border-gray-700/50"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
    >
      {items.map((item, index) => {
        // FIX: Use a type guard ('type' in item) to correctly handle the discriminated union.
        // This ensures TypeScript knows which properties are available on the 'item' object.
        if ('type' in item && item.type === 'divider') {
          return <div key={`divider-${index}`} className="my-1 h-px bg-gray-400/30 dark:bg-gray-600/30"></div>;
        }
        // After the type guard, TypeScript correctly infers 'item' is an action item.
        return (
          <button
            key={item.label}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            className="block w-full text-left px-4 py-1.5 text-sm text-black hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed dark:text-white dark:hover:bg-blue-500"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;