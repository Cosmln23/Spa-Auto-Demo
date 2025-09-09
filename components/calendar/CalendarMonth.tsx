'use client';
import { useMemo, useState } from 'react';

type EventsMap = Record<string, number>; // 'YYYY-MM-DD' -> count

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}
function atStartOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Build a 6x7 matrix starting on Monday */
function buildMonthMatrix(year: number, month: number) {
  const first = firstDayOfMonth(year, month);
  // JS: 0=Sun...6=Sat; We want Monday=0...Sunday=6
  const jsDow = first.getDay(); // 0..6
  const mondayIndex = (jsDow + 6) % 7; // shift so Monday=0
  const gridStart = addDays(first, -mondayIndex);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) days.push(addDays(gridStart, i));
  return days;
}

export default function CalendarMonth({
  value,
  onChange,
  eventsByDate = {},
  locale = 'ro-RO',
}: {
  value: Date;
  onChange: (d: Date) => void;
  eventsByDate?: EventsMap;
  locale?: string;
}) {
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());
  const viewDays = useMemo(() => buildMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);

  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });

  const weekDaysHeader = useMemo(() => {
    const anyMonday = new Date(2025, 0, 6); // Monday
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(anyMonday, i);
      return weekdayFormatter.format(d).replace('.', '');
    });
  }, [weekdayFormatter]);

  const today = atStartOfDay(new Date());
  const selectedYMD = ymd(atStartOfDay(value));

  const goPrev = () => {
    const m = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(m.getFullYear());
    setViewMonth(m.getMonth());
  };
  const goNext = () => {
    const m = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(m.getFullYear());
    setViewMonth(m.getMonth());
  };

  return (
    <section className="p-4 rounded-xl border border-white/10 bg-neutral-900/40">
      <header className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-neutral-200 capitalize">
          {monthFormatter.format(new Date(viewYear, viewMonth, 1))}
        </h3>
        <div className="flex gap-1">
          <button onClick={goPrev} className="size-8 rounded-lg bg-neutral-900/70 border border-white/10 flex items-center justify-center hover:border-cyan-400/40">‹</button>
          <button onClick={goNext} className="size-8 rounded-lg bg-neutral-900/70 border border-white/10 flex items-center justify-center hover:border-cyan-400/40">›</button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1 text-[11px] text-neutral-400 mb-1">
        {weekDaysHeader.map((wd) => (
          <div key={wd} className="text-center py-1">{wd}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {viewDays.map((d, i) => {
          const inMonth = d.getMonth() === viewMonth;
          const isToday = ymd(today) === ymd(atStartOfDay(d));
          const id = ymd(d);
          const isSelected = id === selectedYMD;
          const count = eventsByDate[id] || 0;

          return (
            <button
              key={i}
              onClick={() => onChange(d)}
              className={[
                'aspect-square rounded-lg flex flex-col items-center justify-center border text-sm',
                inMonth ? 'border-white/10 bg-neutral-900/50' : 'border-white/5 bg-neutral-900/30 text-neutral-600',
                isSelected ? 'ring-2 ring-cyan-400/50 shadow-[0_0_0_1px_rgba(34,211,238,.2)]' : '',
                isToday ? 'border-cyan-400/40' : '',
                'hover:border-cyan-400/40 transition-colors',
              ].join(' ')}
            >
              <span className="leading-none">{d.getDate()}</span>
              {count > 0 && (
                <span className="mt-1 inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

