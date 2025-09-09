// POST creare rezervare cu validare coliziuni
// [source: README.md, secțiunea 7 "/app/api/public/bookings/route.ts"]

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { z } from 'zod';

// Validare payload cu zod
const BookingSchema = z.object({
  service_id: z.string().uuid(),
  resource_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  customer_phone: z.string().min(9),
  customer_name: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { service_id, resource_id, starts_at, customer_phone, customer_name } = 
      BookingSchema.parse(payload);

    // 1) calc end time
    const { data: svc } = await supabaseAdmin
      .from('service')
      .select('duration_min')
      .eq('id', service_id)
      .single();
      
    if (!svc) {
      return NextResponse.json({ error: 'service not found' }, { status: 404 });
    }
    
    const ends_at = new Date(
      new Date(starts_at).getTime() + svc.duration_min * 60_000
    ).toISOString();

    // 2) upsert customer
    let { data: cust } = await supabaseAdmin
      .from('customer')
      .select('id')
      .eq('phone', customer_phone)
      .maybeSingle();
      
    if (!cust) {
      const ins = await supabaseAdmin
        .from('customer')
        .insert({ phone: customer_phone, name: customer_name })
        .select('id')
        .single();
        
      if (ins.error) {
        return NextResponse.json({ error: ins.error.message }, { status: 500 });
      }
      cust = ins.data;
    }

    // 3) detect collision (overlap check)
    const { data: busy, error: busyErr } = await supabaseAdmin
      .from('booking')
      .select('id')
      .eq('resource_id', resource_id)
      .eq('status', 'confirmed')
      .lte('starts_at', ends_at)
      .gte('ends_at', starts_at)
      .limit(1);
      
    if (busyErr) {
      return NextResponse.json({ error: busyErr.message }, { status: 500 });
    }
    
    if (busy && busy.length) {
      return NextResponse.json({ error: 'slot not available' }, { status: 409 });
    }

    // 4) get business_id
    const { data: biz } = await supabaseAdmin
      .from('business')
      .select('id')
      .limit(1)
      .single();
      
    if (!biz) {
      return NextResponse.json({ error: 'business not configured' }, { status: 500 });
    }

    // 5) insert booking
    const { data: booking, error: bookingErr } = await supabaseAdmin
      .from('booking')
      .insert({
        business_id: biz.id,
        customer_id: cust.id,
        service_id,
        resource_id,
        starts_at,
        ends_at,
        status: 'confirmed'
      })
      .select('id,starts_at,ends_at')
      .single();

    if (bookingErr) {
      return NextResponse.json({ error: bookingErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, booking });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.issues }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
