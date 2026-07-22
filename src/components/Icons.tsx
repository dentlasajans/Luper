import React from 'react';


export function AppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="50" fill="#121214"/>
      <path d="M 30 25 H 45 V 60 H 70 V 75 H 30 Z" fill="#1a5efd"/>
    </svg>
  );
}

export const AppLogo = React.memo(function AppLogo({ className }: { className?: string }) {
  return (
    <img src="/logo.svg" alt="LUPER" className={className} draggable={false} />
  );
});
