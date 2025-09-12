import React, { useRef, useLayoutEffect, useState } from 'react';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: y, left: x });

  useLayoutEffect(() => {
    if (visible && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const dockHeight = 88; // Approximate height of the dock
      const bottomLimit = window.innerHeight - dockHeight;

      let newY = y;
      if (menuRect.bottom > bottomLimit) {
        newY = y - menuRect.height;
      }

      setMenuPosition({ top: newY, left: x });
    }
  }, [x, y, visible, items]);

  if (!visible) return null;

  const handleItemClick = (item: ContextMenuItem) => {
    if ('action' in item && !item.disabled) {
      item.action();
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white/60 backdrop-blur-xl rounded-md shadow-lg border border-white/50 py-1 z-[60] dark:bg-gray-800/60 dark:border-gray-700/50"
      style={{ top: menuPosition.top, left: menuPosition.left }}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
    >
      {items.map((item, index) => {
        // FIX: Use an explicit if/else block with a type guard to ensure TypeScript correctly
        // differentiates between action items and dividers, resolving property access errors.
        if ('action' in item) {
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
        } else {
          // This must be a divider
          return <div key={`divider-${index}`} className="my-1 h-px bg-gray-400/30 dark:bg-gray-600/30"></div>;
        }
      })}
    </div>
  );
};

export default ContextMenu;