'use client';
import { useMemo } from 'react';

function toHM(n: number) {
  const h = Math.floor(n / 60).toString().padStart(2, '0');
  const m = (n % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function AvailabilityList({
  date,
  booked = [], // ex: ["10:00","12:30"]
  openFrom = '08:00',
  openTo = '18:00',
  stepMin = 30,
  onPick,
}: {
  date: Date;
  booked?: string[];
  openFrom?: string;
  openTo?: string;
  stepMin?: number;
  onPick?: (iso: string) => void;
}) {
  const slots = useMemo(() => {
    const [fh, fm] = openFrom.split(':').map(Number);
    const [th, tm] = openTo.split(':').map(Number);
    const start = fh * 60 + fm;
    const end = th * 60 + tm;
    const arr: string[] = [];
    for (let m = start; m <= end - stepMin; m += stepMin) arr.push(toHM(m));
    return arr;
  }, [openFrom, openTo, stepMin]);

  const ymd = date.toISOString().slice(0, 10);

  return (
    <section className="p-4 rounded-xl border border-white/10 bg-neutral-900/40">
      <h3 className="text-sm text-neutral-300 mb-3">Sloturi disponibile — {ymd}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {slots.map((hm) => {
          const isBooked = booked.includes(hm);
          return (
            <button
              key={hm}
              disabled={isBooked}
              onClick={() => onPick?.(`${ymd}T${hm}:00`)}
              className={[
                'h-10 rounded-xl border text-sm',
                isBooked
                  ? 'border-white/10 bg-neutral-800/50 text-neutral-500 cursor-not-allowed'
                  : 'border-cyan-400/30 bg-gradient-to-b from-cyan-400/10 to-cyan-400/5 text-cyan-100 hover:border-cyan-400/50',
              ].join(' ')}
            >
              {hm}
            </button>
          );
        })}
      </div>
    </section>
  );
}

