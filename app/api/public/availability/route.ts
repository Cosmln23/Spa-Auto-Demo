// GET sloturi libere pentru un serviciu/zi
// [source: README.md, secțiunea 7 "/app/api/public/availability/route.ts"]

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabaseClient';
import { computeAvailability } from '@/lib/availability';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const service_id = searchParams.get('service_id');
  const date = searchParams.get('date'); // YYYY-MM-DD
  
  if (!service_id || !date) {
    return NextResponse.json(
      { error: 'missing params: service_id and date required' }, 
      { status: 400 }
    );
  }

  try {
    const slots = await computeAvailability({ 
      supabase: supabaseAnon, 
      service_id, 
      date, 
      tz: process.env.BUSINESS_TZ || 'Europe/Bucharest' 
    });
    
    return NextResponse.json(slots);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to compute availability' }, 
      { status: 500 }
    );
  }
}
