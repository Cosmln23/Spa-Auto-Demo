export default function DashboardPage() {
  return (
    <main className="min-h-screen w-full flex items-start justify-center bg-neutral-950 p-6">
      <div className="aura-blob fixed inset-0 -z-10" />
      <section className="w-full max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl">Dashboard (Owner)</h1>
          <p className="text-sm text-neutral-400">Liste read-only pentru MVP</p>
        </header>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-white/10 bg-neutral-900/40">
            <h2 className="text-sm text-neutral-300 mb-2">Servicii</h2>
            <ul className="text-sm text-neutral-400 list-disc pl-5">
              <li>Spălare exterior</li>
              <li>Spălare completă</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-neutral-900/40">
            <h2 className="text-sm text-neutral-300 mb-2">Rezervări (astăzi)</h2>
            <p className="text-sm text-neutral-500">Va fi conectat la DB în Faza 4.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

