"use client";
import DesktopShell from '@/components/shells/DesktopShell';
import PhoneFrame from '@/components/PhoneFrame';
import OnboardingScreen from '@/components/screens/OnboardingScreen';
import DashboardScreen from '@/components/screens/DashboardScreen';
import LiveListeningScreen from '@/components/screens/LiveListeningScreen';
import { NeonButton } from '@/components/NeonButton';

export default function DesktopHome() {
  return (
    <DesktopShell>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl md:text-4xl tracking-tight">
          Programări la <span className="text-cyan-400">spălătorie</span>, prin voce.
        </h1>
        <div className="w-72 hidden md:block">
          <NeonButton onClick={() => location.assign('/desktop/dashboard')}>Activează agentul</NeonButton>
        </div>
      </div>

      <div className="grid gap-8 xl:gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center">
        <div className="entrance-1">
          <PhoneFrame>
            <OnboardingScreen onActivate={() => location.assign('/desktop/dashboard')} />
          </PhoneFrame>
        </div>
        <div className="entrance-2">
          <PhoneFrame><DashboardScreen /></PhoneFrame>
        </div>
        <div className="entrance-3">
          <PhoneFrame><LiveListeningScreen /></PhoneFrame>
        </div>
      </div>

      <div className="mt-10 md:hidden">
        <NeonButton onClick={() => location.assign('/desktop/dashboard')}>Activează agentul</NeonButton>
      </div>
    </DesktopShell>
  );
}
