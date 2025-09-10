import { NextRequest, NextResponse } from 'next/server';
import { computeAvailability } from '@/lib/availability';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('service_id');
    const date = searchParams.get('date');

    if (!serviceId) {
      return NextResponse.json(
        { error: 'service_id is required' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'date is required (format: YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const availableSlots = await computeAvailability(serviceId, date);

    return NextResponse.json({
      date,
      service_id: serviceId,
      available_slots: availableSlots,
    });
  } catch (error) {
    console.error('Error in /api/public/availability:', error);
    return NextResponse.json(
      { error: 'Failed to compute availability' },
      { status: 500 }
    );
  }
}
