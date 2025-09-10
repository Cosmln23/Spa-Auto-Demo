-- Enable Row Level Security
-- Note: JWT secret is managed by Supabase automatically

-- Create custom types
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- Business table (single business for now)
CREATE TABLE business (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    timezone VARCHAR(100) DEFAULT 'Europe/Bucharest',
    currency VARCHAR(3) DEFAULT 'RON',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE service (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table (staff, equipment, rooms)
CREATE TABLE resource (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'staff', -- 'staff', 'room', 'equipment'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service-Resource mapping (many-to-many)
CREATE TABLE service_resource (
    service_id UUID REFERENCES service(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resource(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, resource_id)
);

-- Opening hours
CREATE TABLE opening_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resource(id) ON DELETE CASCADE,
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blackout periods (holidays, breaks, maintenance)
CREATE TABLE blackout (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resource(id) ON DELETE CASCADE,
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers
CREATE TABLE customer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    license_plate VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, email),
    UNIQUE(business_id, phone)
);

-- Bookings
CREATE TABLE booking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES service(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resource(id) ON DELETE CASCADE,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_booking_starts_at ON booking(starts_at);
CREATE INDEX idx_booking_ends_at ON booking(ends_at);
CREATE INDEX idx_booking_resource_id ON booking(resource_id);
CREATE INDEX idx_booking_service_id ON booking(service_id);
CREATE INDEX idx_booking_customer_id ON booking(customer_id);
CREATE INDEX idx_booking_business_id ON booking(business_id);
CREATE INDEX idx_service_business_id ON service(business_id);
CREATE INDEX idx_resource_business_id ON resource(business_id);
CREATE INDEX idx_customer_business_id ON customer(business_id);
CREATE INDEX idx_opening_hours_business_id ON opening_hours(business_id);
CREATE INDEX idx_blackout_business_id ON blackout(business_id);

-- Row Level Security Policies
ALTER TABLE business ENABLE ROW LEVEL SECURITY;
ALTER TABLE service ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_resource ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blackout ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking ENABLE ROW LEVEL SECURITY;

-- Public read access for services (for booking widget)
CREATE POLICY "Public can view active services" ON service
    FOR SELECT USING (is_active = true);

-- Public read access for opening hours (for availability)
CREATE POLICY "Public can view opening hours" ON opening_hours
    FOR SELECT USING (is_active = true);

-- Public read access for resources (for availability)
CREATE POLICY "Public can view active resources" ON resource
    FOR SELECT USING (is_active = true);

-- Public read access for service_resource mapping
CREATE POLICY "Public can view service resources" ON service_resource
    FOR SELECT USING (true);

-- Public read access for business info
CREATE POLICY "Public can view business" ON business
    FOR SELECT USING (true);

-- Public read access for blackouts (for availability)
CREATE POLICY "Public can view blackouts" ON blackout
    FOR SELECT USING (true);

-- Public read access for existing bookings (for availability)
CREATE POLICY "Public can view bookings for availability" ON booking
    FOR SELECT USING (true);

-- Public insert access for customers and bookings (for booking widget)
CREATE POLICY "Public can create customers" ON customer
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create bookings" ON booking
    FOR INSERT WITH CHECK (true);

-- Authenticated users (business owners) have full access
CREATE POLICY "Authenticated users have full access to business" ON business
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to services" ON service
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to resources" ON resource
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to service_resource" ON service_resource
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to opening_hours" ON opening_hours
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to blackouts" ON blackout
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to customers" ON customer
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to bookings" ON booking
    FOR ALL USING (auth.role() = 'authenticated');

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_business_updated_at BEFORE UPDATE ON business
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_updated_at BEFORE UPDATE ON service
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_updated_at BEFORE UPDATE ON resource
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_updated_at BEFORE UPDATE ON customer
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_updated_at BEFORE UPDATE ON booking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
