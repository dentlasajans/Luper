import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { memo } from 'react';

interface SortableWidgetProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export const SortableWidget = memo(function SortableWidget({ id, className, children }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative ${className || ''}`}>
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-4 right-4 cursor-grab active:cursor-grabbing p-2 z-20 text-white/40 hover:text-white transition-colors rounded-lg bg-black/10 hover:bg-black/40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
          <path d="M96,72A16,16,0,1,1,80,56,16,16,0,0,1,96,72Zm-16,40a16,16,0,1,0,16,16A16,16,0,0,0,80,112Zm0,72a16,16,0,1,0,16,16A16,16,0,0,0,80,184Zm96-128a16,16,0,1,0-16,16A16,16,0,0,0,176,56Zm0,72a16,16,0,1,0-16,16A16,16,0,0,0,176,128Zm0,72a16,16,0,1,0-16,16A16,16,0,0,0,176,200Z" />
        </svg>
      </div>
      {children}
    </div>
  );
});
