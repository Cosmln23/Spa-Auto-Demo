// Algoritm calcul disponibilitate sloturi
// [source: README.md, secțiunea 6 "Algoritm disponibilitate" + secțiunea 8]

import { SupabaseClient } from '@supabase/supabase-js';
import { AvailabilitySlot } from './types';

type Args = { 
  supabase: SupabaseClient; 
  service_id: string; 
  date: string; // YYYY-MM-DD
  tz: string; 
};

export async function computeAvailability({ 
  supabase, 
  service_id, 
  date, 
  tz 
}: Args): Promise<AvailabilitySlot[]> {
  // 1) ia service
  const { data: svc } = await supabase
    .from('service')
    .select('duration_min')
    .eq('id', service_id)
    .single();
  
  if (!svc) return [];

  // 2) ia programul zilei (weekday: 0=Mon)
  const weekday = new Date(date + 'T00:00:00').getDay(); // 0=Sun...
  const wd = (weekday + 6) % 7; // 0=Mon
  
  const { data: hours } = await supabase
    .from('opening_hours')
    .select('open_time,close_time')
    .eq('weekday', wd)
    .limit(1)
    .single();
  
  if (!hours) return [];

  // 3) ia resurse
  const { data: resources } = await supabase
    .from('resource')
    .select('id,capacity');
  
  if (!resources?.length) return [];

  // 4) extrage booking-urile existente ale zilei
  const startDay = new Date(`${date}T00:00:00Z`).toISOString();
  const endDay = new Date(`${date}T23:59:59Z`).toISOString();
  
  const { data: bookings } = await supabase
    .from('booking')
    .select('resource_id, starts_at, ends_at')
    .gte('starts_at', startDay)
    .lte('ends_at', endDay)
    .eq('status', 'confirmed');

  // 5) generează sloturi simple (pas 15m)
  const step = 15; // minute
  const dur = svc.duration_min;
  const slots: AvailabilitySlot[] = [];
  
  for (const r of resources) {
    const open = new Date(`${date}T${hours.open_time}`);
    const close = new Date(`${date}T${hours.close_time}`);
    
    for (let t = +open; t + dur * 60000 <= +close; t += step * 60000) {
      const s = new Date(t);
      const e = new Date(t + dur * 60000);
      
      // Verifică overlap cu booking-urile existente
      const overlap = bookings?.some(b => 
        b.resource_id === r.id && 
        !(+new Date(b.ends_at) <= +s || +new Date(b.starts_at) >= +e)
      );
      
      if (!overlap) {
        slots.push({ 
          resource_id: r.id, 
          starts_at: s.toISOString() 
        });
      }
    }
  }
  
  // întoarce primele 12 sloturi ordonate
  return slots
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .slice(0, 12);
}
