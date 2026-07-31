import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'motion/react';
import { SpinnerGap, Check } from '@/src/components/ui/Icons';

export type LuperButtonStatus = 'idle' | 'loading' | 'success';

export interface LuperButtonProps extends HTMLMotionProps<"button"> {
  status?: LuperButtonStatus;
  variant?: 'primary' | 'surface' | 'card';
  loadingText?: string;
  successText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const LuperButton = React.forwardRef<HTMLButtonElement, LuperButtonProps>(
  ({ 
    status = 'idle', 
    variant = 'surface',
    loadingText = 'Isleniyor...', 
    successText = 'Tamamlandi', 
    children, 
    icon, 
    fullWidth, 
    className = '', 
    ...props 
  }, ref) => {
    const isIdle = status === 'idle';
    const isLoading = status === 'loading';
    const isSuccess = status === 'success';

    // Base classes
    let baseStyles = 'relative overflow-hidden flex items-center justify-center space-x-2 rounded-xl text-[13px] font-medium transition-colors duration-300 select-none';
    
    if (variant === 'card') {
      baseStyles = 'relative overflow-hidden flex flex-col items-center justify-center p-5 rounded-xl transition-all duration-300 group';
    } else {
      baseStyles += ' px-4 py-2.5';
    }

    if (fullWidth) baseStyles += ' w-full';

    // Variant specific styles for idle
    let idleStyles = '';
    if (variant === 'surface') {
      idleStyles = 'bg-[#1a1a1d] text-[#f5f5f7] border border-white/[0.08] hover:border-luper-primary/40 shadow-sm';
    } else if (variant === 'primary') {
      idleStyles = 'bg-luper-primary text-white hover:bg-luper-primary/85 shadow-[0_0_12px_rgba(26,94,253,0.3)]';
    } else if (variant === 'card') {
      idleStyles = 'bg-[#1a1a1d] border border-white/[0.05] hover:border-luper-primary/25 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-luper-primary/40 focus-visible:outline-none';
    }

    const disabledStyles = 'bg-[#1a1a1d] text-[#a1a1a6]/50 border border-white/[0.02] cursor-not-allowed';
    
    // Status styles
    const loadingStyles = variant === 'card' 
      ? 'bg-[#1a1a1d] border border-white/[0.05] cursor-not-allowed' 
      : 'bg-[#1a1a1d] text-[#a1a1a6] border border-white/[0.05] cursor-not-allowed';
      
    const successStyles = variant === 'card'
      ? 'bg-[#1a1a1d] border border-[#34c759]/30'
      : 'bg-[#1a1a1d] text-[#34c759] border border-[#34c759]/30';

    return (
      <motion.button
        ref={ref}
        disabled={isLoading || isSuccess || props.disabled}
        whileTap={isIdle && !props.disabled && variant !== 'card' ? { scale: 0.96 } : variant === 'card' && isIdle && !props.disabled ? { scale: 0.98 } : {}}
        className={`
          ${baseStyles}
          ${isIdle && !props.disabled ? idleStyles : ''} 
          ${isLoading ? loadingStyles : ''}
          ${isSuccess ? successStyles : ''}
          ${props.disabled && isIdle ? disabledStyles : ''}
          ${className}
        `}
        {...props}
      >
        {variant === 'card' ? (
          <>
            <div className={`w-10 h-10 rounded-xl bg-[#1a1a1d] border border-white/[0.06] flex items-center justify-center mb-3 transition-all duration-300
              ${isIdle && !props.disabled ? 'group-hover:bg-luper-primary/10 group-hover:border-luper-primary/20' : ''}
              ${isSuccess ? 'ring-2 ring-luper-success/30 ring-offset-1 ring-offset-transparent' : ''}
            `}>
              {isLoading ? (
                <SpinnerGap size={18} weight="duotone" className="text-luper-primary animate-spin" />
              ) : isSuccess ? (
                <Check size={18} weight="duotone" className="text-luper-success" />
              ) : (
                <div className="text-[#86868b] group-hover:text-luper-primary group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  {icon}
                </div>
              )}
            </div>
            {children}
          </>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {isIdle && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="flex items-center space-x-1.5 w-full justify-center"
              >
                {icon}
                <span>{children as React.ReactNode}</span>
              </motion.div>
            )}

            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="flex items-center space-x-1.5 w-full justify-center"
              >
                <SpinnerGap size={14} weight="duotone" className="animate-spin text-luper-primary" />
                <span>{loadingText}</span>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center space-x-1.5 w-full justify-center"
              >
                <Check size={16} weight="bold" />
                <span>{successText}</span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        {/* Morphing Progress Bar */}
        {isLoading && (
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-luper-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          />
        )}
      </motion.button>
    );
  }
);

LuperButton.displayName = 'LuperButton';
