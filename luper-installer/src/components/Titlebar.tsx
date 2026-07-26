import React from 'react';
import { X, Minus } from 'lucide-react';

export const Titlebar: React.FC = () => {
  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.invoke('window-close');
    }
  };

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.invoke('window-minimize');
    }
  };

  return (
    <div className="h-12 flex items-center justify-between px-4 drag-region w-full">
      <div className="flex items-center gap-2">
        <img src="/icon.ico" alt="Luper Icon" className="w-4 h-4 object-contain" />
        <span className="text-sm font-medium text-white/70 tracking-wider">LUPER INSTALLER</span>
      </div>
      
      <div className="flex items-center gap-2 no-drag">
        <button 
          onClick={handleMinimize}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Minus size={16} />
        </button>
        <button 
          onClick={handleClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-red-500/80 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
