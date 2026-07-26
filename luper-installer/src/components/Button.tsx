import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => {
  const baseStyles = "px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ease-out active:scale-[0.98] flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-luper-sapphire hover:bg-luper-sapphire-light text-white shadow-[0_0_15px_rgba(26,94,253,0.3)] hover:shadow-[0_0_25px_rgba(26,94,253,0.5)] border border-white/10",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md",
    ghost: "bg-transparent hover:bg-white/5 text-white/70 hover:text-white border border-transparent",
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
