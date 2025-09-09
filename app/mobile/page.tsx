'use client';
import MobileShell from '@/components/shells/MobileShell';
import OnboardingScreen from '@/components/screens/OnboardingScreen';

export default function MobileHome() {
  return (
    <MobileShell>
      <OnboardingScreen onActivate={() => location.assign('/mobile/dashboard')} />
      <div className="mt-4 text-sm text-neutral-400 space-y-1">
        <p>• Programări rapide prin voce, fără apel.</p>
        <p>• Fallback formular dacă preferi manual.</p>
      </div>
    </MobileShell>
  );
}
