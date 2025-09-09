'use client';
export default function LiveListeningScreen() {
  return (
    <div className="relative px-8 pb-8 pt-6 flex flex-col h-full">
      <div className="mt-8 min-h-[128px]">
        <div className="text-[19px] leading-7 tracking-tight">
          <span className="bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
            Spune-mi ce serviciu dorești și când îți este ok.
          </span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative z-10 flex items-center justify-center w-56 h-56 rounded-full overflow-hidden">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover rounded-full" />
        </div>
      </div>
      <p className="text-center mb-8 text-sm text-neutral-400 animate-pulse">Ascult…</p>
      <div className="w-36 h-1 bg-white/30 rounded-full mx-auto" />
    </div>
  );
}

