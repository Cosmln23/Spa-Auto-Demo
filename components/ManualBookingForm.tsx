'use client';
import { useState } from 'react';
import { NeonButton } from '@/components/NeonButton';

export default function ManualBookingForm() {
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <form className="space-y-3 p-4 rounded-xl border border-white/10 bg-neutral-900/40">
      <h3 className="text-sm text-neutral-300">Programare manuală (fallback)</h3>
      <div>
        <label className="text-xs text-neutral-400">Serviciu</label>
        <select value={service} onChange={e=>setService(e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50">
          <option value="">Alege...</option>
          <option value="ext">Spălare exterior</option>
          <option value="full">Spălare completă</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-400">Data</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50" />
        </div>
        <div>
          <label className="text-xs text-neutral-400">Ora</label>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-400">Nume</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50" />
        </div>
        <div>
          <label className="text-xs text-neutral-400">Telefon</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/50" />
        </div>
      </div>
      <NeonButton variant="outline">Trimite (MVP – neconectat)</NeonButton>
    </form>
  );
}

