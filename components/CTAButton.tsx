'use client';
import { NeonButton } from '@/components/NeonButton';

export default function CTAButton() {
  return (
    <NeonButton onClick={() => location.assign('/desktop/dashboard')}>
      Activează agentul
    </NeonButton>
  );
}
