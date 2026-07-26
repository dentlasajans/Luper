import React from 'react';
import { Button } from './Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  nextText?: string;
  prevText?: string;
  isNextDisabled?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  subtitle, 
  children, 
  onNext, 
  onPrev, 
  nextText = 'Devam Et', 
  prevText = 'Geri',
  isNextDisabled = false
}) => {
  return (
    <div className="flex-1 flex flex-col h-full relative">
      <div className="flex-1 flex flex-col pt-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-white/50 mt-2 text-sm">{subtitle}</p>}
        
        <div className="mt-8 flex-1 overflow-y-auto pr-2 pb-20">
          {children}
        </div>
      </div>

      {/* Footer controls */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent flex items-end pb-2">
        <div className="flex-1 flex justify-between items-center px-2">
          <div>
            {onPrev && (
              <Button variant="ghost" onClick={onPrev}>
                <ChevronLeft size={18} />
                {prevText}
              </Button>
            )}
          </div>
          <div>
            {onNext && (
              <Button variant="primary" onClick={onNext} disabled={isNextDisabled} className={isNextDisabled ? 'opacity-50 pointer-events-none' : ''}>
                {nextText}
                <ChevronRight size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
