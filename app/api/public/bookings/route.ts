import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseServer } from '@/lib/supabaseClient';
import type {
  CreateBookingRequest,
  CreateBookingResponse,
  Customer,
  Booking,
} from '@/lib/types';

const BUSINESS_ID = '550e8400-e29b-41d4-a716-446655440000'; // Demo business ID
const BUSINESS_TZ = 'Europe/Bucharest';

// Validation schema
const createBookingSchema = z.object({
  service_id: z.string().uuid(),
  resource_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  customer_name: z.string().min(1).max(255),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().min(1).max(50).optional(),
  customer_license_plate: z.string().max(20).optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createBookingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 1. Get service details to calculate end time
    const supabase = getSupabaseServer();
    const { data: service, error: serviceError } = await supabase
      .from('service')
      .select('duration_minutes')
      .eq('id', data.service_id)
      .eq('is_active', true)
      .single();

    if (serviceError || !service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // 2. Calculate end time
    const startsAt = new Date(data.starts_at);
    const endsAt = new Date(
      startsAt.getTime() + service.duration_minutes * 60 * 1000
    );

    // 3. Upsert customer (find existing or create new)
    let customer: Customer;

    if (data.customer_email) {
      // Try to find existing customer by email
      const { data: existingCustomer } = await supabase
        .from('customer')
        .select('*')
        .eq('business_id', BUSINESS_ID)
        .eq('email', data.customer_email)
        .single();

      if (existingCustomer) {
        // Update existing customer
        const { data: updatedCustomer, error: updateError } =
          await supabase
            .from('customer')
            .update({
              name: data.customer_name,
              phone: data.customer_phone,
              license_plate: data.customer_license_plate,
            })
            .eq('id', existingCustomer.id)
            .select('*')
            .single();

        if (updateError) {
          throw new Error('Failed to update customer');
        }
        customer = updatedCustomer;
      } else {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from('customer')
          .insert({
            business_id: BUSINESS_ID,
            name: data.customer_name,
            email: data.customer_email,
            phone: data.customer_phone,
            license_plate: data.customer_license_plate,
          })
          .select('*')
          .single();

        if (createError) {
          throw new Error('Failed to create customer');
        }
        customer = newCustomer;
      }
    } else if (data.customer_phone) {
      // Try to find existing customer by phone
      const { data: existingCustomer } = await supabase
        .from('customer')
        .select('*')
        .eq('business_id', BUSINESS_ID)
        .eq('phone', data.customer_phone)
        .single();

      if (existingCustomer) {
        // Update existing customer
        const { data: updatedCustomer, error: updateError } =
          await supabase
            .from('customer')
            .update({
              name: data.customer_name,
              license_plate: data.customer_license_plate,
            })
            .eq('id', existingCustomer.id)
            .select('*')
            .single();

        if (updateError) {
          throw new Error('Failed to update customer');
        }
        customer = updatedCustomer;
      } else {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from('customer')
          .insert({
            business_id: BUSINESS_ID,
            name: data.customer_name,
            phone: data.customer_phone,
            license_plate: data.customer_license_plate,
          })
          .select('*')
          .single();

        if (createError) {
          throw new Error('Failed to create customer');
        }
        customer = newCustomer;
      }
    } else {
      // Create customer without email/phone
      const { data: newCustomer, error: createError } = await supabase
        .from('customer')
        .insert({
          business_id: BUSINESS_ID,
          name: data.customer_name,
          license_plate: data.customer_license_plate,
        })
        .select('*')
        .single();

      if (createError) {
        throw new Error('Failed to create customer');
      }
      customer = newCustomer;
    }

    // 4. Check for booking conflicts
    const { data: conflictingBookings, error: conflictError } =
      await supabase
        .from('booking')
        .select('id')
        .eq('business_id', BUSINESS_ID)
        .eq('resource_id', data.resource_id)
        .neq('status', 'cancelled')
        .or(
          `and(starts_at.lte.${endsAt.toISOString()},ends_at.gte.${startsAt.toISOString()})`
        );

    if (conflictError) {
      throw new Error('Failed to check for conflicts');
    }

    if (conflictingBookings && conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Time slot is no longer available' },
        { status: 409 }
      );
    }

    // 5. Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('booking')
      .insert({
        business_id: BUSINESS_ID,
        customer_id: customer.id,
        service_id: data.service_id,
        resource_id: data.resource_id,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: 'pending',
        notes: data.notes,
      })
      .select(
        `
        *,
        customer (*),
        service (*),
        resource (*)
      `
      )
      .single();

    if (bookingError || !booking) {
      throw new Error('Failed to create booking');
    }

    const response: CreateBookingResponse = {
      booking: booking as any, // Type assertion due to complex join
      message: 'Booking created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error in /api/public/bookings:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
