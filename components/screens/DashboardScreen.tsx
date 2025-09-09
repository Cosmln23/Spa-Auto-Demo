export default function DashboardScreen() {
  return (
    <div className="relative flex flex-col h-full pt-4 pr-6 pb-6 pl-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[18px] text-white">Spa Auto Demo</h2>
          <p className="text-xs text-neutral-400">Owner dashboard</p>
        </div>
        <button
          aria-label="Deschide meniul"
          className="size-8 rounded-full bg-neutral-900/60 border border-white/10"
        />
      </div>

      <div className="mb-4 p-4 rounded-xl border border-white/10 bg-neutral-900/30">
        <h4 className="text-xs text-neutral-400 mb-3 px-1">Meniu</h4>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <Action label="Servicii" />
          <Action label="Program" />
          <Action label="Rezervări" />
          <Action label="Setări" />
        </div>
      </div>

      <div className="mt-auto w-36 h-1 bg-white/30 rounded-full mx-auto" />
    </div>
  );
}

function Action({ label }: { label: string }) {
  return (
    <button className="p-3 rounded-xl bg-gradient-to-b from-cyan-400/10 to-cyan-400/5 border border-cyan-400/20">
      <span className="text-cyan-300">{label}</span>
    </button>
  );
}
