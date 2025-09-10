import { useState, useRef, useEffect, useCallback } from 'react';

export const useDraggable = (
  initialPosition: { x: number; y: number }, 
  onDragStart?: () => void,
  onDragStop?: (position: { x: number, y: number }) => void,
  gridSnap: number = 1
) => {
  const [position, setPosition] = useState(initialPosition);
  const dragRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart();
    }
    const target = dragRef.current;
    if (!target) return;
    
    // Prevent drag from starting on right-click
    if (e.button === 2) return;

    isDraggingRef.current = true;
    
    // We calculate offset from the element's actual position, not the initial mouse position
    const rect = target.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    e.preventDefault();
  }, [onDragStart]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    setPosition({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
    e.preventDefault();
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    if (onDragStop) {
        const newX = e.clientX - offsetRef.current.x;
        const newY = e.clientY - offsetRef.current.y;

        const snappedX = Math.round(newX / gridSnap) * gridSnap;
        const snappedY = Math.round(newY / gridSnap) * gridSnap;
        
        // Clamp to viewport
        const target = dragRef.current;
        const rect = target ? target.getBoundingClientRect() : { width: 80, height: 100 }; // fallback size for icons
        const finalX = Math.max(0, Math.min(snappedX, window.innerWidth - rect.width));
        const finalY = Math.max(0, Math.min(snappedY, window.innerHeight - rect.height));
        
        const finalPosition = { x: finalX, y: finalY };
        
        setPosition(finalPosition);
        onDragStop(finalPosition);
    }
  }, [onDragStop, gridSnap]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return { position, dragRef, onMouseDown };
};