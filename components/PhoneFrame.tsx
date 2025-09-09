'use client';
import { PropsWithChildren } from 'react';

export default function PhoneFrame({ children }: PropsWithChildren) {
  return (
    <div className="w-[390px] max-w-full">
      <div className="relative rounded-[3rem] p-[2px] bg-gradient-to-b from-cyan-400/60 via-blue-500/40 to-cyan-500/60 shadow-[0_20px_80px_-12px_rgba(6,182,212,0.4)]">
        <div className="rounded-[2.9rem] bg-black overflow-hidden h-[844px] relative neon-border">
          <div className="flex items-center justify-between px-8 pt-4 pb-2">
            <div className="text-white text-sm">9:41</div>
            <div className="w-6 h-5 rounded-full bg-neutral-800/70" />
            <div className="flex items-center gap-1 text-white">
              <div className="w-6 h-3 rounded-sm border border-white/60 relative">
                <div className="absolute inset-0.5 bg-white rounded-[1px]" />
                <div className="absolute -right-0.5 top-1 w-0.5 h-1 bg-white/60 rounded-r-sm" />
              </div>
            </div>
          </div>
          <div className="h-[calc(100%-40px)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
