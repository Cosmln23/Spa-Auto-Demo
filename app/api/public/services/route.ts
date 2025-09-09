// GET servicii active
// [source: README.md, secțiunea 7 "/app/api/public/services/route.ts"]

import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabaseAnon
    .from('service')
    .select('id,name,duration_min,price_cents')
    .eq('is_active', true)
    .order('name');
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
