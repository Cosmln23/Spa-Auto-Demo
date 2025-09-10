import { getSupabaseServer } from './supabaseClient';
import type {
  Service,
  Resource,
  OpeningHours,
  Booking,
  AvailabilitySlot,
  DayOfWeek,
} from './types';

const BUSINESS_ID = '550e8400-e29b-41d4-a716-446655440000'; // Demo business ID
const BUSINESS_TZ = 'Europe/Bucharest';

// Convert day number to day name
function getDayName(dayNumber: number): DayOfWeek {
  const days: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[dayNumber];
}

// Parse time string to minutes since midnight
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes since midnight to time string
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Generate time slots between start and end time with given duration
function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number
): string[] {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const slots: string[] = [];

  for (
    let current = startMinutes;
    current + durationMinutes <= endMinutes;
    current += 30
  ) {
    slots.push(minutesToTime(current));
  }

  return slots;
}

// Check if two time ranges overlap
function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = timeToMinutes(end1);
  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = timeToMinutes(end2);

  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
}

export async function computeAvailability(
  serviceId: string,
  date: string
): Promise<AvailabilitySlot[]> {
  try {
    // 1. Get service details
    const supabase = getSupabaseServer();
    const { data: service, error: serviceError } = await supabase
      .from('service')
      .select('*')
      .eq('id', serviceId)
      .eq('is_active', true)
      .single();

    if (serviceError || !service) {
      throw new Error('Service not found');
    }

    // 2. Get available resources for this service
    const { data: serviceResources, error: resourcesError } = await supabase
      .from('service_resource')
      .select(
        `
        resource_id,
        resource:resource_id (
          id,
          name,
          type,
          is_active
        )
      `
      )
      .eq('service_id', serviceId);

    if (resourcesError || !serviceResources) {
      throw new Error('No resources found for service');
    }

    const resources: Resource[] = [];

    for (const sr of serviceResources) {
      const resource = sr.resource as any;
      if (resource && resource.is_active) {
        resources.push(resource as Resource);
      }
    }

    if (resources.length === 0) {
      return [];
    }

    // 3. Get day of week
    const targetDate = new Date(date + 'T00:00:00');
    const dayOfWeek = getDayName(targetDate.getDay());

    // 4. Get opening hours for each resource
    const { data: openingHours, error: hoursError } = await supabase
      .from('opening_hours')
      .select('*')
      .eq('business_id', BUSINESS_ID)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .in(
        'resource_id',
        resources.map((r) => r.id)
      );

    if (hoursError || !openingHours) {
      return [];
    }

    // 5. Get existing bookings for the date
    const startOfDay = `${date}T00:00:00+02:00`;
    const endOfDay = `${date}T23:59:59+02:00`;

    const { data: existingBookings, error: bookingsError } = await supabase
      .from('booking')
      .select('*')
      .eq('business_id', BUSINESS_ID)
      .gte('starts_at', startOfDay)
      .lte('starts_at', endOfDay)
      .in(
        'resource_id',
        resources.map((r) => r.id)
      )
      .neq('status', 'cancelled');

    if (bookingsError) {
      throw new Error('Failed to fetch existing bookings');
    }

    // 6. Get blackout periods for the date
    const { data: blackouts, error: blackoutsError } = await supabase
      .from('blackout')
      .select('*')
      .eq('business_id', BUSINESS_ID)
      .lte('start_datetime', endOfDay)
      .gte('end_datetime', startOfDay);

    if (blackoutsError) {
      throw new Error('Failed to fetch blackout periods');
    }

    // 7. Generate available slots for each resource
    const availableSlots: AvailabilitySlot[] = [];

    for (const resource of resources) {
      // Find opening hours for this resource
      const resourceHours = openingHours.find(
        (h) => h.resource_id === resource.id
      );
      if (!resourceHours) continue;

      // Generate all possible time slots
      const possibleSlots = generateTimeSlots(
        resourceHours.start_time,
        resourceHours.end_time,
        service.duration_minutes
      );

      for (const slotTime of possibleSlots) {
        const slotEndTime = minutesToTime(
          timeToMinutes(slotTime) + service.duration_minutes
        );

        // Check if slot conflicts with existing bookings
        const hasBookingConflict = existingBookings?.some((booking) => {
          if (booking.resource_id !== resource.id) return false;

          const bookingStart = new Date(booking.starts_at).toLocaleTimeString(
            'en-GB',
            {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              timeZone: BUSINESS_TZ,
            }
          );
          const bookingEnd = new Date(booking.ends_at).toLocaleTimeString(
            'en-GB',
            {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              timeZone: BUSINESS_TZ,
            }
          );

          return timeRangesOverlap(
            slotTime,
            slotEndTime,
            bookingStart,
            bookingEnd
          );
        });

        // Check if slot conflicts with blackout periods
        const hasBlackoutConflict = blackouts?.some((blackout) => {
          if (blackout.resource_id && blackout.resource_id !== resource.id)
            return false;

          const blackoutStart = new Date(
            blackout.start_datetime
          ).toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            timeZone: BUSINESS_TZ,
          });
          const blackoutEnd = new Date(
            blackout.end_datetime
          ).toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            timeZone: BUSINESS_TZ,
          });

          return timeRangesOverlap(
            slotTime,
            slotEndTime,
            blackoutStart,
            blackoutEnd
          );
        });

        // If no conflicts, add to available slots
        if (!hasBookingConflict && !hasBlackoutConflict) {
          availableSlots.push({
            start_time: slotTime,
            end_time: slotEndTime,
            resource_id: resource.id,
            resource_name: resource.name,
          });
        }
      }
    }

    // Sort slots by time
    return availableSlots.sort((a, b) =>
      a.start_time.localeCompare(b.start_time)
    );
  } catch (error) {
    console.error('Error computing availability:', error);
    throw error;
  }
}
