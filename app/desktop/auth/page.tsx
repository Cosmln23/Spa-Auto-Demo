import DesktopShell from '@/components/shells/DesktopShell';
import { NeonButton } from '@/components/NeonButton';

export default function DesktopAuthPage() {
  return (
    <DesktopShell>
      <section className="w-full max-w-md mx-auto p-6 rounded-2xl border border-white/10 bg-neutral-900/40">
        <h1 className="text-xl mb-4">Owner login</h1>
        <form className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400">Email</label>
            <input type="email" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50" />
          </div>
          <div>
            <label className="text-sm text-neutral-400">Parolă</label>
            <input type="password" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50" />
          </div>
          <NeonButton variant="primary">Autentifică-te</NeonButton>
        </form>
      </section>
    </DesktopShell>
  );
}

