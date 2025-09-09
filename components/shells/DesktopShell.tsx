import { PropsWithChildren } from 'react';

export default function DesktopShell({ children }: PropsWithChildren) {
  return (
    <main className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aura-blob" />
      </div>
      <section className="mx-auto max-w-[1400px] px-6 py-10">{children}</section>
    </main>
  );
}

