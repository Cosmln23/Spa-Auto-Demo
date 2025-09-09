// TypeScript definitions for MVP
// [source: README.md, "Schema SQL secțiunea 5"]

export interface Business {
  id: string;
  name: string;
  tz: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  duration_min: number;
  price_cents: number;
  is_active: boolean;
}

export interface Resource {
  id: string;
  business_id: string;
  name: string;
  capacity: number;
}

export interface OpeningHours {
  id: string;
  business_id: string;
  weekday: number; // 0=Mon
  open_time: string;
  close_time: string;
}

export interface Blackout {
  id: string;
  business_id: string;
  starts_at: string;
  ends_at: string;
  reason?: string;
}

export interface Customer {
  id: string;
  phone: string;
  name?: string;
  email?: string;
}

export interface Booking {
  id: string;
  business_id: string;
  customer_id: string;
  service_id: string;
  resource_id: string;
  starts_at: string;
  ends_at: string;
  status: 'confirmed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface AvailabilitySlot {
  resource_id: string;
  starts_at: string;
}

export interface BookingRequest {
  service_id: string;
  resource_id: string;
  starts_at: string;
  customer_phone: string;
  customer_name?: string;
}
