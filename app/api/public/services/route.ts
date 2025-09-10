import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';
import type { Service } from '@/lib/types';

export async function GET() {
  try {
    const { data: services, error } = await supabaseServer
      .from('service')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      );
    }

    return NextResponse.json({ services: services as Service[] });
  } catch (error) {
    console.error('Unexpected error in /api/public/services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
