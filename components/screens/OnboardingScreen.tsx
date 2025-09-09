'use client';
import { NeonButton } from '@/components/NeonButton';

export default function OnboardingScreen({ onActivate }: { onActivate: () => void }) {
  return (
    <div className="relative flex flex-col h-full pt-12 pr-8 pb-8 pl-8">
      <div className="relative mx-auto mt-12 w-72 h-72 rounded-full overflow-hidden">
        <span className="absolute inset-0 ring-[40px] ring-cyan-400/20 z-10 rounded-full"></span>
        <video autoPlay loop muted playsInline className="w-full h-full object-cover rounded-full" />
      </div>

      <div className="flex-1 flex flex-col justify-center mt-6">
        <h2 className="text-[38px] leading-tight text-white/90 tracking-tight">
          Programări prin voce, instant
        </h2>
        <p className="text-[16px] leading-6 text-neutral-400 mt-4">
          Un singur buton pentru clienți. Dashboard simplu pentru tine.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        <NeonButton variant="primary" onClick={onActivate}>Activează agentul</NeonButton>
        <NeonButton variant="outline" onClick={() => location.assign('/auth')}>Owner login</NeonButton>
      </div>

      <div className="w-36 h-1 bg-white/30 rounded-full mx-auto" />
    </div>
  );
}

