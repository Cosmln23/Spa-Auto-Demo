import { NeonButton } from '@/components/NeonButton';

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-950">
      <div className="aura-blob fixed inset-0 -z-10" />
      <section className="w-full max-w-sm mx-auto p-6 rounded-2xl border border-white/10 bg-neutral-900/40">
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
        <p className="mt-4 text-xs text-neutral-500">Încă nu ai cont? Creează-l în Supabase (MVP).</p>
      </section>
    </main>
  );
}

