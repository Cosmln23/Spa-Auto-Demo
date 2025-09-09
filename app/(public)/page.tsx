'use client';
import PhoneFrame from '@/components/PhoneFrame';
import OnboardingScreen from '@/components/screens/OnboardingScreen';
import DashboardScreen from '@/components/screens/DashboardScreen';
import LiveListeningScreen from '@/components/screens/LiveListeningScreen';
import CTAButton from '@/components/CTAButton';

export default function PublicPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aura-blob" />
      </div>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-8 py-10">
        <div className="hidden md:flex items-center justify-between mb-10">
          <h1 className="text-2xl md:text-4xl tracking-tight">
            Programări la <span className="text-cyan-400">spălătorie</span>,
            prin voce.
          </h1>
          <div className="w-72">
            <CTAButton />
          </div>
        </div>

        <div className="grid gap-8 xl:gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center">
          <div className="entrance-1">
            <PhoneFrame>
              <OnboardingScreen
                onActivate={() => location.assign('/desktop/dashboard')}
              />
            </PhoneFrame>
          </div>
          <div className="entrance-2">
            <PhoneFrame>
              <DashboardScreen />
            </PhoneFrame>
          </div>
          <div className="entrance-3">
            <PhoneFrame>
              <LiveListeningScreen />
            </PhoneFrame>
          </div>
        </div>

        <div className="mt-10 md:hidden">
          <CTAButton />
        </div>
      </section>
    </main>
  );
}
