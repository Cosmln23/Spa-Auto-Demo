'use client';
import { PropsWithChildren } from 'react';

export default function MobileShell({ children }: PropsWithChildren) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aura-blob" />
      </div>
      <section className="w-full max-w-sm px-4 py-6">{children}</section>
    </main>
  );
}

