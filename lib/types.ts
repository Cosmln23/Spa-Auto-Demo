// Database types matching the Supabase schema

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
export type ResourceType = 'staff' | 'room' | 'equipment';

export interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  is_active: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  business_id: string;
  name: string;
  type: ResourceType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceResource {
  service_id: string;
  resource_id: string;
}

export interface OpeningHours {
  id: string;
  business_id: string;
  resource_id?: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

export interface Blackout {
  id: string;
  business_id: string;
  resource_id?: string;
  start_datetime: string;
  end_datetime: string;
  reason?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  license_plate?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  business_id: string;
  customer_id: string;
  service_id: string;
  resource_id: string;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Extended types with relations for API responses
export interface BookingWithDetails extends Booking {
  customer: Customer;
  service: Service;
  resource: Resource;
}

export interface ServiceWithResources extends Service {
  resources: Resource[];
}

// API request/response types
export interface AvailabilityRequest {
  service_id: string;
  date: string;
}

export interface AvailabilitySlot {
  start_time: string;
  end_time: string;
  resource_id: string;
  resource_name: string;
}

export interface CreateBookingRequest {
  service_id: string;
  resource_id: string;
  starts_at: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_license_plate?: string;
  notes?: string;
}

export interface CreateBookingResponse {
  booking: BookingWithDetails;
  message: string;
}
