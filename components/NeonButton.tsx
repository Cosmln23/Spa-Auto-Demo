'use client';
import React from 'react';

type Props = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  id?: string;
  onClick?: () => void;
};

export function NeonButton({ children, variant='primary', className='', ...rest }: Props) {
  const base = "w-full h-14 rounded-2xl font-medium text-[15px] relative overflow-hidden border-2 transition-all duration-300";
  const primary = "border-cyan-400/70 text-white shadow-[inset_0_0_10px_rgba(0,212,255,.4),0_0_9px_3px_rgba(0,212,255,.1)] " +
                  "bg-gradient-to-r from-cyan-400/40 via-cyan-400/60 to-cyan-400/40 hover:shadow-[inset_0_0_15px_rgba(0,212,255,.6),0_0_15px_5px_rgba(0,212,255,.2)]";
  const outline = "border-blue-400/60 text-blue-300 shadow-[inset_0_0_10px_rgba(0,180,255,.3),0_0_9px_3px_rgba(0,180,255,.1)] " +
                  "bg-gradient-to-r from-blue-400/10 via-transparent to-blue-400/10 hover:from-blue-400/20 hover:to-blue-400/20";
  return (
    <button {...rest} className={`${base} ${variant==='primary'?primary:outline} ${className}`}>
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

