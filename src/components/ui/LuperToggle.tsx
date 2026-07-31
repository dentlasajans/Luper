
import { motion } from 'motion/react';
import { Check, SpinnerGap } from '@/src/components/ui/Icons';

export interface LuperToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
  isSuccess?: boolean;
  className?: string;
}

export function LuperToggle({
  checked,
  onChange,
  disabled = false,
  isProcessing = false,
  isSuccess = false,
  className
}: LuperToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled && !isProcessing) onChange();
      }}
      disabled={disabled || isProcessing}
      className={`relative w-[48px] h-[26px] rounded-full transition-all duration-200 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none shrink-0 ${checked ? 'bg-luper-primary' : 'bg-white/[0.1] border border-white/[0.05]'} ${(disabled || isProcessing) ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'} ${className || ''}`}
    >
      {isProcessing && (
        <SpinnerGap weight="duotone" size={12} className={`absolute animate-spin ${checked ? "text-white left-[7px]" : "text-text-muted right-[7px]"}`} />
      )}
      {isSuccess && (
        <Check weight="bold" size={12} className={`absolute ${checked ? "text-white left-[7px]" : "text-luper-success right-[7px]"}`} />
      )}
      <motion.div
        className={`absolute top-0.5 bottom-0.5 w-[22px] rounded-full shadow-sm ${checked ? 'bg-white' : 'bg-[#98989d]'}`}
        initial={false}
        animate={{
          left: checked ? '23px' : '2px',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

