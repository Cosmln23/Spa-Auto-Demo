"use client";
import { useEffect, useMemo, useState } from 'react';
import MobileShell from '@/components/shells/MobileShell';
import CalendarMonth from '@/components/calendar/CalendarMonth';
import AvailabilityList from '@/components/calendar/AvailabilityList';

type NavItem = { id: string; label: string };

export default function MobileDashboardPage() {
  const [selected, setSelected] = useState<Date>(new Date());
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [openAddService, setOpenAddService] = useState<boolean>(false);
  const [openAddClient, setOpenAddClient] = useState<boolean>(false);
  const [openEditProgram, setOpenEditProgram] = useState<boolean>(false);
  const [openEditSettings, setOpenEditSettings] = useState<boolean>(false);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayYmd = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const eventsByDate = useMemo(() => ({ [todayYmd]: 3 } as Record<string, number>), [todayYmd]);

  const sections: NavItem[] = useMemo(() => ([
    { id: 'bookings', label: 'Rezervări' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'services', label: 'Servicii' },
    { id: 'clients', label: 'Clienți' },
    { id: 'program', label: 'Program' },
    { id: 'history', label: 'Istoric' },
    { id: 'settings', label: 'Setări' },
  ]), []);

  // Demo data (same as desktop)
  const services = useMemo(() => ([
    { name: 'Spălare exterior', price: 30, duration: 20 },
    { name: 'Spălare completă', price: 60, duration: 45 },
  ]), []);
  const clients = useMemo(() => ([
    { name: 'Andrei Pop', email: 'andrei.pop@email.com', phone: '0721234567', address: 'Str. Florilor 12, București', plateNumber: 'B123ABC' },
    { name: 'Maria Ionescu', email: 'maria.ionescu@gmail.com', phone: '0734567890', address: 'Bd. Unirii 45, București', plateNumber: 'B456DEF' },
    { name: 'Ion Georgescu', email: 'ion.georgescu@yahoo.com', phone: '0745678901', address: 'Calea Victoriei 78, București', plateNumber: '' },
  ]), []);
  const todaysBookings = useMemo(() => ([
    { name: 'Andrei Pop', service: 'Spălare exterior', time: '10:00–10:20', price: 30 },
    { name: 'Maria Ionescu', service: 'Spălare completă', time: '12:30–13:15', price: 60 },
    { name: 'Ion Georgescu', service: 'Spălare exterior', time: '16:00–16:20', price: 30 },
  ]), []);
  const weeklyProgram = useMemo(() => ([
    { day: 'Luni', open: '08:00', close: '18:00' },
    { day: 'Marți', open: '08:00', close: '18:00' },
    { day: 'Miercuri', open: '08:00', close: '18:00' },
    { day: 'Joi', open: '08:00', close: '18:00' },
    { day: 'Vineri', open: '08:00', close: '18:00' },
    { day: 'Sâmbătă', open: '08:00', close: '18:00' },
    { day: 'Duminică', open: '08:00', close: '18:00' },
  ]), []);
  const history = useMemo(() => ([
    { date: todayYmd, time: '09:00', name: 'Elena D.', service: 'Spălare exterior', status: 'confirmată' },
    { date: todayYmd, time: '11:00', name: 'C. Mihai', service: 'Spălare completă', status: 'confirmată' },
    { date: todayYmd, time: '15:00', name: 'Radu P.', service: 'Spălare exterior', status: 'anulată' },
  ]), [todayYmd]);

  // Swipe handling
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (direction === 'right' && currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSection = () => {
    const section = sections[currentSection];
    
    switch (section.id) {
      case 'bookings':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Rezervări</h3>
              <span className="text-xs text-cyan-300">{todaysBookings.length} total</span>
            </div>
            <div className="overflow-x-auto max-h-60 overflow-y-auto scrollbar-custom">
              <table className="w-full text-xs">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-1 px-1">Nume</th>
                    <th className="text-left py-1 px-1">Serviciu</th>
                    <th className="text-left py-1 px-1">Ora</th>
                    <th className="text-left py-1 px-1">Tarif</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {todaysBookings.map((b, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 px-2">{b.name}</td>
                      <td className="py-2 px-2">{b.service}</td>
                      <td className="py-2 px-2">{b.time}</td>
                      <td className="py-2 px-2">{b.price} RON</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="p-4 space-y-4">
            <CalendarMonth value={selected} onChange={setSelected} eventsByDate={eventsByDate} />
            <AvailabilityList date={selected} booked={["10:00", "12:30"]} onPick={(iso) => console.log('Pick slot:', iso)} />
          </div>
        );

      case 'services':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Servicii</h3>
              <button onClick={() => setOpenAddService(true)} className="h-7 px-2 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs">+ Adaugă</button>
            </div>
            <div className="overflow-x-auto max-h-60 overflow-y-auto scrollbar-custom">
              <table className="w-full text-xs">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-1 px-1">Serviciu</th>
                    <th className="text-left py-1 px-1">Preț (RON)</th>
                    <th className="text-left py-1 px-1">Durată (min)</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {services.map(s => (
                    <tr key={s.name} className="border-b border-white/5">
                      <td className="py-1 px-1">{s.name}</td>
                      <td className="py-1 px-1">{s.price}</td>
                      <td className="py-1 px-1">{s.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Clienți</h3>
              <button onClick={() => setOpenAddClient(true)} className="h-7 px-2 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs">+ Adaugă</button>
            </div>
            <div className="overflow-x-auto max-h-60 overflow-y-auto scrollbar-custom">
              <table className="w-full text-xs">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-1 px-1">Nume</th>
                    <th className="text-left py-1 px-1">Email</th>
                    <th className="text-left py-1 px-1">Telefon</th>
                    <th className="text-left py-1 px-1">Nr. auto</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {clients.map((c, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 px-2">{c.name}</td>
                      <td className="py-2 px-2">{c.email}</td>
                      <td className="py-2 px-2">{c.phone}</td>
                      <td className="py-2 px-2">{c.plateNumber || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'program':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Program</h3>
              <button onClick={() => setOpenEditProgram(true)} className="h-7 px-2 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs">Editează</button>
            </div>
            <div className="overflow-x-auto max-h-60 overflow-y-auto scrollbar-custom">
              <table className="w-full text-xs">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-1 px-1">Zi</th>
                    <th className="text-left py-1 px-1">Deschide</th>
                    <th className="text-left py-1 px-1">Închide</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {weeklyProgram.map((r) => (
                    <tr key={r.day} className="border-b border-white/5">
                      <td className="py-1 px-1">{r.day}</td>
                      <td className="py-1 px-1">{r.open}</td>
                      <td className="py-1 px-1">{r.close}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="p-4">
            <h3 className="text-sm text-neutral-300 mb-3">Istoric rezervări</h3>
            <div className="overflow-x-auto max-h-60 overflow-y-auto scrollbar-custom">
              <table className="w-full text-xs">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-1 px-1">Data</th>
                    <th className="text-left py-1 px-1">Ora</th>
                    <th className="text-left py-1 px-1">Nume</th>
                    <th className="text-left py-1 px-1">Serviciu</th>
                    <th className="text-left py-1 px-1">Status</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {history.map((h, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 px-2">{h.date}</td>
                      <td className="py-2 px-2">{h.time}</td>
                      <td className="py-2 px-2">{h.name}</td>
                      <td className="py-2 px-2">{h.service}</td>
                      <td className="py-2 px-2">{h.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Setări</h3>
              <button onClick={() => setOpenEditSettings(true)} className="h-7 px-2 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs">Editează</button>
            </div>
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-neutral-400">
                    <tr className="border-b border-white/10"><th className="text-left py-1 px-1" colSpan={2}>Agent</th></tr>
                  </thead>
                  <tbody className="text-neutral-300">
                    <tr className="border-b border-white/5"><td className="py-1 px-1">Temperature</td><td className="py-1 px-1">0.2</td></tr>
                    <tr className="border-b border-white/5"><td className="py-1 px-1">Max tool calls</td><td className="py-1 px-1">8</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-neutral-400">
                    <tr className="border-b border-white/10"><th className="text-left py-1 px-1" colSpan={2}>General</th></tr>
                  </thead>
                  <tbody className="text-neutral-300">
                    <tr className="border-b border-white/5"><td className="py-1 px-1">Timezone</td><td className="py-1 px-1">Europe/Bucharest</td></tr>
                    <tr className="border-b border-white/5"><td className="py-1 px-1">Valută</td><td className="py-1 px-1">RON</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-neutral-400">
                    <tr className="border-b border-white/10"><th className="text-left py-1 px-1" colSpan={2}>Utilizator</th></tr>
                  </thead>
                  <tbody className="text-neutral-300">
                    <tr className="border-b border-white/5"><td className="py-1 px-1">Nume</td><td className="py-1 px-1">Owner Demo</td></tr>
                    <tr className="border-b border-white/5"><td className="py-1 px-1">Email</td><td className="py-1 px-1">owner@example.com</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-4">Section not found</div>;
    }
  };

  return (
    <MobileShell>
      {/* Header cu ceas și email */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg text-white">Spa Auto Demo</h1>
            <p className="text-xs text-neutral-400">Owner dashboard</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 bg-neutral-900/40">
            <div className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-neutral-200 font-mono">{currentTime}</span>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 bg-neutral-900/40">
            <div className="size-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">O</span>
            </div>
            <span className="text-xs text-neutral-200">owner@example.com</span>
          </div>
        </div>
      </div>

      {/* Meniu navigare cu swipe */}
      <div className="mb-4 p-3 rounded-xl border border-white/10 bg-neutral-900/30">
        <h4 className="text-xs text-neutral-400 mb-2 px-1">Meniu</h4>
        <div 
          className="flex gap-2 overflow-x-auto pb-2 touch-pan-x scrollbar-custom"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            (e.currentTarget as any).startX = touch.clientX;
          }}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0];
            const startX = (e.currentTarget as any).startX;
            const deltaX = touch.clientX - startX;
            
            if (Math.abs(deltaX) > 30) {
              handleSwipe(deltaX > 0 ? 'right' : 'left');
            }
          }}
        >
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={[
                'flex-shrink-0 px-4 py-3 rounded-lg border transition-colors text-sm whitespace-nowrap',
                currentSection === index
                  ? 'border-cyan-400/40 bg-gradient-to-b from-cyan-400/10 to-cyan-400/5 text-cyan-100'
                  : 'border-white/10 bg-neutral-900/50 text-neutral-300'
              ].join(' ')}
            >
              <span className="text-cyan-300">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conținut secțiune cu swipe */}
      <div 
        className="rounded-xl border border-white/10 bg-neutral-900/40 min-h-96 touch-pan-x"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          (e.currentTarget as any).startX = touch.clientX;
        }}
        onTouchEnd={(e) => {
          const touch = e.changedTouches[0];
          const startX = (e.currentTarget as any).startX;
          const deltaX = touch.clientX - startX;
          
          if (Math.abs(deltaX) > 50) {
            handleSwipe(deltaX > 0 ? 'right' : 'left');
          }
        }}
      >
        {renderSection()}
      </div>

      {/* Indicatori secțiune */}
      <div className="flex justify-center gap-1 mt-3">
        {sections.map((_, index) => (
          <div
            key={index}
            className={[
              'w-2 h-2 rounded-full',
              currentSection === index ? 'bg-cyan-400' : 'bg-neutral-600'
            ].join(' ')}
          />
        ))}
      </div>

      {/* Modals (same as desktop but smaller) */}
      {openAddService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenAddService(false)} />
          <div className="relative w-full max-w-sm p-4 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur">
            <h4 className="text-sm text-neutral-200 mb-3">Adaugă serviciu</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400">Denumire</label>
                <input className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400/50" placeholder="Ex: Spălare interior" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400">Durată (min)</label>
                  <input type="number" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400/50" placeholder="30" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Preț (RON)</label>
                  <input type="number" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400/50" placeholder="50" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpenAddService(false)} className="h-8 px-3 rounded-lg border border-white/10 text-neutral-300 text-xs">Anulează</button>
              <button onClick={() => setOpenAddService(false)} className="h-8 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs">Salvează</button>
            </div>
          </div>
        </div>
      )}

      {openAddClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenAddClient(false)} />
          <div className="relative w-full max-w-sm p-4 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur">
            <h4 className="text-sm text-neutral-200 mb-3">Adaugă client</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400">Nume *</label>
                <input className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400/50" placeholder="Ion Popescu" />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Email *</label>
                <input type="email" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400/50" placeholder="ion@email.com" />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Telefon *</label>
                <input type="tel" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400/50" placeholder="0721234567" />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Nr. auto (opțional)</label>
                <input className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400/50" placeholder="B123ABC" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpenAddClient(false)} className="h-8 px-3 rounded-lg border border-white/10 text-neutral-300 text-xs">Anulează</button>
              <button onClick={() => setOpenAddClient(false)} className="h-8 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs">Salvează</button>
            </div>
          </div>
        </div>
      )}

      {openEditProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenEditProgram(false)} />
          <div className="relative w-full max-w-sm p-4 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur">
            <h4 className="text-sm text-neutral-200 mb-3">Editează program</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-1 px-1">Zi</th>
                    <th className="text-left py-1 px-1">Deschide</th>
                    <th className="text-left py-1 px-1">Închide</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {weeklyProgram.map((r) => (
                    <tr key={r.day} className="border-b border-white/5">
                      <td className="py-1 px-1">{r.day}</td>
                      <td className="py-1 px-1"><input defaultValue={r.open} className="w-16 rounded-md bg-neutral-900 border border-white/10 px-1 py-0.5 text-xs" /></td>
                      <td className="py-1 px-1"><input defaultValue={r.close} className="w-16 rounded-md bg-neutral-900 border border-white/10 px-1 py-0.5 text-xs" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpenEditProgram(false)} className="h-8 px-3 rounded-lg border border-white/10 text-neutral-300 text-xs">Anulează</button>
              <button onClick={() => setOpenEditProgram(false)} className="h-8 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs">Salvează</button>
            </div>
          </div>
        </div>
      )}

      {openEditSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenEditSettings(false)} />
          <div className="relative w-full max-w-sm p-4 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur max-h-[80vh] overflow-y-auto">
            <h4 className="text-sm text-neutral-200 mb-3">Editează setări</h4>
            <div className="space-y-3">
              <div>
                <h5 className="text-xs text-neutral-300 mb-2">Agent</h5>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-neutral-400">Temperature</label>
                    <input defaultValue="0.2" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400">Max tool calls</label>
                    <input defaultValue="8" type="number" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-xs" />
                  </div>
                </div>
              </div>
              <div>
                <h5 className="text-xs text-neutral-300 mb-2">General</h5>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-neutral-400">Timezone</label>
                    <select defaultValue="Europe/Bucharest" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-xs">
                      <option value="Europe/Bucharest">Europe/Bucharest</option>
                      <option value="Europe/London">Europe/London</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400">Valută</label>
                    <select defaultValue="RON" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-xs">
                      <option value="RON">RON</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="text-xs text-neutral-300 mb-2">Utilizator</h5>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-neutral-400">Nume</label>
                    <input defaultValue="Owner Demo" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400">Email</label>
                    <input defaultValue="owner@example.com" type="email" className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-xs" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpenEditSettings(false)} className="h-8 px-3 rounded-lg border border-white/10 text-neutral-300 text-xs">Anulează</button>
              <button onClick={() => setOpenEditSettings(false)} className="h-8 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs">Salvează</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-radius: 10px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #0891b2, #2563eb);
        }
        .scrollbar-custom::-webkit-scrollbar-corner {
          background: rgba(255, 255, 255, 0.1);
        }
        
        /* Firefox scrollbar */
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #06b6d4 rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </MobileShell>
  );
}
