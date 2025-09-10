'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DesktopShell from '@/components/shells/DesktopShell';
import CalendarMonth from '@/components/calendar/CalendarMonth';
import AvailabilityList from '@/components/calendar/AvailabilityList';
import { getSupabaseBrowser } from '@/lib/supabaseClient';
import type { Service, BookingWithDetails } from '@/lib/types';

type NavItem = { id: string; label: string; badge?: string };

export default function DesktopDashboardPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Date>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [openAddService, setOpenAddService] = useState<boolean>(false);
  const [openAddClient, setOpenAddClient] = useState<boolean>(false);
  const [openEditProgram, setOpenEditProgram] = useState<boolean>(false);
  const [openEditSettings, setOpenEditSettings] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Real data state
  const [services, setServices] = useState<Service[]>([]);
  const [todayBookings, setTodayBookings] = useState<BookingWithDetails[]>([]);
  const [allBookings, setAllBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('owner@example.com');

  // Check authentication and fetch user
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUserEmail(user.email || 'owner@example.com');
    };
    checkAuth();
  }, [router]);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ro-RO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch services
        const supabase = getSupabaseBrowser();
        const { data: servicesData, error: servicesError } = await supabase
          .from('service')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (servicesError) throw servicesError;
        setServices(servicesData || []);

        // Fetch today's bookings
        const today = new Date().toISOString().split('T')[0];
        const { data: todayData, error: todayError } = await supabase
          .from('booking')
          .select(
            `
            *,
            customer (*),
            service (*),
            resource (*)
          `
          )
          .gte('starts_at', `${today}T00:00:00`)
          .lt('starts_at', `${today}T23:59:59`)
          .order('starts_at');

        if (todayError) throw todayError;
        setTodayBookings(todayData || []);

        // Fetch all bookings (last 30 days + future)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: allData, error: allError } = await supabase
          .from('booking')
          .select(
            `
            *,
            customer (*),
            service (*),
            resource (*)
          `
          )
          .gte('starts_at', thirtyDaysAgo.toISOString())
          .order('starts_at', { ascending: false });

        if (allError) throw allError;
        setAllBookings(allData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Eroare la încărcarea datelor');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Logout function
  const handleLogout = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const todayYmd = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const eventsByDate = useMemo(
    () => ({ [todayYmd]: todayBookings.length }) as Record<string, number>,
    [todayYmd, todayBookings]
  );
  const [active, setActive] = useState<string>('overview');

  const navItems: NavItem[] = useMemo(
    () => [
      { id: 'bookings', label: 'Rezervări' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'services', label: 'Servicii' },
      { id: 'clients', label: 'Clienți' },
      { id: 'program', label: 'Program' },
      { id: 'history', label: 'Istoric rezervări' },
      { id: 'settings', label: 'Setări' },
    ],
    []
  );

  // Demo data
  const servicesForTable = useMemo(
    () =>
      services.map((service) => ({
        name: service.name,
        price: service.price ? `${service.price} RON` : 'N/A',
        duration: `${service.duration_minutes} min`,
      })),
    [services]
  );
  const clients = useMemo(
    () => [
      {
        name: 'Andrei Pop',
        email: 'andrei.pop@email.com',
        phone: '0721234567',
        address: 'Str. Florilor 12, București',
        plateNumber: 'B123ABC',
      },
      {
        name: 'Maria Ionescu',
        email: 'maria.ionescu@gmail.com',
        phone: '0734567890',
        address: 'Bd. Unirii 45, București',
        plateNumber: 'B456DEF',
      },
      {
        name: 'Ion Georgescu',
        email: 'ion.georgescu@yahoo.com',
        phone: '0745678901',
        address: 'Calea Victoriei 78, București',
        plateNumber: '',
      },
    ],
    []
  );
  const todaysBookings = useMemo(
    () =>
      todayBookings.map((booking) => ({
        name: booking.customer.name,
        service: booking.service.name,
        time: `${new Date(booking.starts_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}–${new Date(booking.ends_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`,
        price: booking.service.price || 0,
      })),
    [todayBookings]
  );
  const weeklyProgram = useMemo(
    () => [
      { day: 'Luni', open: '08:00', close: '18:00' },
      { day: 'Marți', open: '08:00', close: '18:00' },
      { day: 'Miercuri', open: '08:00', close: '18:00' },
      { day: 'Joi', open: '08:00', close: '18:00' },
      { day: 'Vineri', open: '08:00', close: '18:00' },
      { day: 'Sâmbătă', open: '08:00', close: '18:00' },
      { day: 'Duminică', open: '08:00', close: '18:00' },
    ],
    []
  );
  const history = useMemo(
    () =>
      allBookings.map((booking) => ({
        date: new Date(booking.starts_at).toLocaleDateString('ro-RO'),
        time: new Date(booking.starts_at).toLocaleTimeString('ro-RO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        name: booking.customer.name,
        service: booking.service.name,
        status:
          booking.status === 'completed'
            ? 'finalizată'
            : booking.status === 'confirmed'
              ? 'confirmată'
              : booking.status === 'pending'
                ? 'în așteptare'
                : booking.status === 'cancelled'
                  ? 'anulată'
                  : booking.status,
      })),
    [allBookings]
  );

  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    console.debug(
      '[scrollspy] mount; sections:',
      sections.map((s) => s.id)
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top =
          visible[0] ||
          entries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
        if (top?.target?.id) {
          setActive(top.target.id);
          console.debug('[scrollspy] active ->', top.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <DesktopShell>
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            aria-label={sidebarOpen ? 'Închide toolbar' : 'Deschide toolbar'}
            onClick={() => setSidebarOpen((v) => !v)}
            className="size-8 rounded-full bg-neutral-900/60 border border-white/10 hover:border-cyan-400/40"
          />
          <div>
            <h1 className="text-[18px] text-white">Spa Auto Demo</h1>
            <p className="text-sm text-neutral-400">Owner dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-neutral-900/40">
            <div className="size-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-neutral-200 font-mono">
              {currentTime}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-neutral-900/40">
            <div className="size-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">O</span>
            </div>
            <span className="text-sm text-neutral-200">{userEmail}</span>
          </div>
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-neutral-400">Se încarcă datele...</div>
        </div>
      )}

      {error && (
        <div className="mx-4 p-4 rounded-lg bg-red-900/20 border border-red-500/20 text-red-400">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 text-red-300 hover:text-red-200 underline"
          >
            Reîncarcă
          </button>
        </div>
      )}

      <div
        className={[
          'grid grid-cols-1 gap-6',
          sidebarOpen ? 'md:grid-cols-[260px_1fr]' : 'md:grid-cols-1',
        ].join(' ')}
      >
        {/* Sidebar stânga */}
        {sidebarOpen && (
          <aside className="md:sticky md:top-6 p-3 rounded-xl border border-white/10 bg-neutral-900/40 h-max">
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-xs text-neutral-400">Meniu</h2>
              <button
                aria-label="Închide toolbar"
                onClick={() => setSidebarOpen(false)}
                className="size-7 rounded-md bg-neutral-900/60 border border-white/10 hover:border-cyan-400/40"
              />
            </div>
            <nav className="flex md:flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={[
                    'group relative w-full text-left px-3 py-2 rounded-lg border transition-colors',
                    active === item.id
                      ? 'border-cyan-400/40 bg-gradient-to-b from-cyan-400/10 to-cyan-400/5 text-cyan-100 ring-1 ring-cyan-400/20'
                      : 'border-white/10 bg-neutral-900/50 text-neutral-300 hover:border-cyan-400/30 hover:text-cyan-100',
                  ].join(' ')}
                >
                  <span>{item.label}</span>
                  {item.id === 'today' && (eventsByDate[todayYmd] || 0) > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 text-[10px] rounded-full border border-cyan-400/40 text-cyan-200 bg-cyan-400/10">
                      {eventsByDate[todayYmd]}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Conținut dreapta */}
        <div className="space-y-6">
          {/* Rezervări → tabel cu Tarif */}
          <section
            id="bookings"
            className="p-4 rounded-xl border border-white/10 bg-neutral-900/40"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Rezervări</h3>
              <span className="text-xs text-cyan-300">
                {todaysBookings.length} total
              </span>
            </div>
            <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-custom">
              <table className="w-full text-sm">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2">Nume</th>
                    <th className="text-left py-2 px-2">Serviciu</th>
                    <th className="text-left py-2 px-2">Ora</th>
                    <th className="text-left py-2 px-2">Tarif (RON)</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {todaysBookings.map((b, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 px-2">{b.name}</td>
                      <td className="py-2 px-2">{b.service}</td>
                      <td className="py-2 px-2">{b.time}</td>
                      <td className="py-2 px-2">{b.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Calendar + Sloturi */}
          <section id="calendar" className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <CalendarMonth
                value={selected}
                onChange={setSelected}
                eventsByDate={eventsByDate}
              />
            </div>
            <div className="md:col-span-2">
              <AvailabilityList
                date={selected}
                booked={['10:00', '12:30']}
                onPick={(iso) => console.log('Pick slot:', iso)}
              />
            </div>
          </section>

          {/* Servicii → tabel + buton Adaugă */}
          <section
            id="services"
            className="p-4 rounded-xl border border-white/10 bg-neutral-900/40"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Servicii</h3>
              <button
                onClick={() => setOpenAddService(true)}
                className="h-8 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs hover:border-cyan-400/60"
              >
                + Adaugă serviciu
              </button>
            </div>
            <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-custom">
              <table className="w-full text-sm">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2">Serviciu</th>
                    <th className="text-left py-2 px-2">Preț (RON)</th>
                    <th className="text-left py-2 px-2">Durată (min)</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {servicesForTable.map((s) => (
                    <tr key={s.name} className="border-b border-white/5">
                      <td className="py-2 px-2">{s.name}</td>
                      <td className="py-2 px-2">{s.price}</td>
                      <td className="py-2 px-2">{s.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Clienți → tabel + buton Adaugă */}
          <section
            id="clients"
            className="p-4 rounded-xl border border-white/10 bg-neutral-900/40"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Clienți</h3>
              <button
                onClick={() => setOpenAddClient(true)}
                className="h-8 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs hover:border-cyan-400/60"
              >
                + Adaugă client
              </button>
            </div>
            <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-custom">
              <table className="w-full text-sm">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2">Nume</th>
                    <th className="text-left py-2 px-2">Email</th>
                    <th className="text-left py-2 px-2">Telefon</th>
                    <th className="text-left py-2 px-2">Adresă</th>
                    <th className="text-left py-2 px-2">Nr. înmatriculare</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {clients.map((c, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 px-2">{c.name}</td>
                      <td className="py-2 px-2">{c.email}</td>
                      <td className="py-2 px-2">{c.phone}</td>
                      <td className="py-2 px-2">{c.address}</td>
                      <td className="py-2 px-2">{c.plateNumber || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Program → tabel 3 coloane + Editare */}
          <section
            id="program"
            className="p-4 rounded-xl border border-white/10 bg-neutral-900/40"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Program</h3>
              <button
                onClick={() => setOpenEditProgram(true)}
                className="h-8 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs hover:border-cyan-400/60"
              >
                Editează program
              </button>
            </div>
            <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-custom">
              <table className="w-full text-sm">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2">Zi</th>
                    <th className="text-left py-2 px-2">Deschide</th>
                    <th className="text-left py-2 px-2">Închide</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {weeklyProgram.map((r) => (
                    <tr key={r.day} className="border-b border-white/5">
                      <td className="py-2 px-2">{r.day}</td>
                      <td className="py-2 px-2">{r.open}</td>
                      <td className="py-2 px-2">{r.close}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Istoric rezervări → tabel */}
          <section
            id="history"
            className="p-4 rounded-xl border border-white/10 bg-neutral-900/40"
          >
            <h3 className="text-sm text-neutral-300 mb-3">Istoric rezervări</h3>
            <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-custom">
              <table className="w-full text-sm">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2">Data</th>
                    <th className="text-left py-2 px-2">Ora</th>
                    <th className="text-left py-2 px-2">Nume</th>
                    <th className="text-left py-2 px-2">Serviciu</th>
                    <th className="text-left py-2 px-2">Status</th>
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
          </section>

          {/* Setări → tabele simple + buton edit */}
          <section
            id="settings"
            className="p-4 rounded-xl border border-white/10 bg-neutral-900/40"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-neutral-300">Setări</h3>
              <button
                onClick={() => setOpenEditSettings(true)}
                className="h-8 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10 text-xs hover:border-cyan-400/60"
              >
                Editează setări
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-neutral-400">
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2" colSpan={2}>
                        Agent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-300">
                    <tr className="border-b border-white/5">
                      <td className="py-2 px-2">Temperature</td>
                      <td className="py-2 px-2">0.2</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 px-2">Max tool calls</td>
                      <td className="py-2 px-2">8</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-neutral-400">
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2" colSpan={2}>
                        General
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-300">
                    <tr className="border-b border-white/5">
                      <td className="py-2 px-2">Timezone</td>
                      <td className="py-2 px-2">Europe/Bucharest</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 px-2">Valută</td>
                      <td className="py-2 px-2">RON</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto md:col-span-2">
                <table className="w-full text-sm">
                  <thead className="text-neutral-400">
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2" colSpan={2}>
                        Utilizator
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-300">
                    <tr className="border-b border-white/5">
                      <td className="py-2 px-2">Nume</td>
                      <td className="py-2 px-2">Owner Demo</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 px-2">Email</td>
                      <td className="py-2 px-2">{userEmail}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal: Adaugă serviciu (demo) */}
      {openAddService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpenAddService(false)}
          />
          <div className="relative w-full max-w-md p-4 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur">
            <h4 className="text-sm text-neutral-200 mb-3">Adaugă serviciu</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400">Denumire</label>
                <input
                  className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50"
                  placeholder="Ex: Spălare interior"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400">
                    Durată (min)
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Preț (RON)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpenAddService(false)}
                className="h-9 px-3 rounded-lg border border-white/10 text-neutral-300"
              >
                Anulează
              </button>
              <button
                onClick={() => setOpenAddService(false)}
                className="h-9 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10"
              >
                Salvează
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adaugă client (demo) */}
      {openAddClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpenAddClient(false)}
          />
          <div className="relative w-full max-w-2xl p-4 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur">
            <h4 className="text-sm text-neutral-200 mb-3">Adaugă client</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400">Nume *</label>
                <input
                  className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50"
                  placeholder="Ex: Ion Popescu"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Email *</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50"
                  placeholder="ion.popescu@email.com"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Telefon *</label>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50"
                  placeholder="0721234567"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">
                  Nr. înmatriculare (opțional)
                </label>
                <input
                  className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50"
                  placeholder="B123ABC"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-neutral-400">Adresă</label>
                <input
                  className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50"
                  placeholder="Str. Exemplu 123, București"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpenAddClient(false)}
                className="h-9 px-3 rounded-lg border border-white/10 text-neutral-300"
              >
                Anulează
              </button>
              <button
                onClick={() => setOpenAddClient(false)}
                className="h-9 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10"
              >
                Salvează
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editează program (demo) */}
      {openEditProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpenEditProgram(false)}
          />
          <div className="relative w-full max-w-2xl p-4 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur">
            <h4 className="text-sm text-neutral-200 mb-3">Editează program</h4>
            <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-custom">
              <table className="w-full text-sm">
                <thead className="text-neutral-400">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2">Zi</th>
                    <th className="text-left py-2 px-2">Deschide</th>
                    <th className="text-left py-2 px-2">Închide</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {weeklyProgram.map((r) => (
                    <tr key={r.day} className="border-b border-white/5">
                      <td className="py-2 px-2">{r.day}</td>
                      <td className="py-2 px-2">
                        <input
                          defaultValue={r.open}
                          className="w-28 rounded-md bg-neutral-900 border border-white/10 px-2 py-1"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          defaultValue={r.close}
                          className="w-28 rounded-md bg-neutral-900 border border-white/10 px-2 py-1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpenEditProgram(false)}
                className="h-9 px-3 rounded-lg border border-white/10 text-neutral-300"
              >
                Anulează
              </button>
              <button
                onClick={() => setOpenEditProgram(false)}
                className="h-9 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10"
              >
                Salvează
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editează setări (demo) */}
      {openEditSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpenEditSettings(false)}
          />
          <div className="relative w-full max-w-3xl p-4 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur">
            <h4 className="text-sm text-neutral-200 mb-3">Editează setări</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-xs text-neutral-300 mb-2">Agent</h5>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-neutral-400">
                      Temperature
                    </label>
                    <input
                      defaultValue="0.2"
                      className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400">
                      Max tool calls
                    </label>
                    <input
                      defaultValue="8"
                      type="number"
                      className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h5 className="text-xs text-neutral-300 mb-2">General</h5>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-neutral-400">Timezone</label>
                    <select
                      defaultValue="Europe/Bucharest"
                      className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-sm"
                    >
                      <option value="Europe/Bucharest">Europe/Bucharest</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400">Valută</label>
                    <select
                      defaultValue="RON"
                      className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-sm"
                    >
                      <option value="RON">RON</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h5 className="text-xs text-neutral-300 mb-2">Utilizator</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400">Nume</label>
                    <input
                      defaultValue="Owner Demo"
                      className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400">Email</label>
                    <input
                      defaultValue={userEmail}
                      type="email"
                      className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpenEditSettings(false)}
                className="h-9 px-3 rounded-lg border border-white/10 text-neutral-300"
              >
                Anulează
              </button>
              <button
                onClick={() => setOpenEditSettings(false)}
                className="h-9 px-3 rounded-lg border border-cyan-400/40 text-cyan-200 bg-cyan-400/10"
              >
                Salvează
              </button>
            </div>
          </div>
        </div>
      )}
    </DesktopShell>
  );
}
