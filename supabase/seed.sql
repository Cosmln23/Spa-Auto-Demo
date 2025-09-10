-- Ensure business table exists first
-- If you get this error, run the full schema.sql first

-- Insert demo business
INSERT INTO business (id, name, description, address, phone, email, website, timezone, currency) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Spa Auto Demo',
    'Servicii complete de detailing auto și spălătorie premium',
    'Strada Demo nr. 123, București, România',
    '+40 123 456 789',
    'contact@spaautodemo.ro',
    'https://spaautodemo.ro',
    'Europe/Bucharest',
    'RON'
);

-- Insert demo services
INSERT INTO service (id, business_id, name, description, duration_minutes, price, is_active, color) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Spălare Exterioară',
    'Spălare completă exterioară cu spumă activă și ceară protectoare',
    30,
    25.00,
    true,
    '#3B82F6'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'Spălare Completă',
    'Spălare exterioară + aspirare interioară + curățare geamuri',
    60,
    45.00,
    true,
    '#10B981'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    'Detailing Premium',
    'Serviciu complet de detailing: ceruire, polish, protecție ceramică',
    120,
    150.00,
    true,
    '#F59E0B'
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440000',
    'Curățare Interioară',
    'Aspirare, curățare tapițerie, tratament piele',
    45,
    35.00,
    true,
    '#EF4444'
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ceruire Auto',
    'Aplicare ceară protectoare pentru vopsea',
    90,
    80.00,
    true,
    '#8B5CF6'
);

-- Insert demo resources (staff)
INSERT INTO resource (id, business_id, name, type, is_active) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440000',
    'Andrei - Specialist Detailing',
    'staff',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440000',
    'Maria - Spălătorie',
    'staff',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ion - Curățare Interioară',
    'staff',
    true
);

-- Map services to resources
INSERT INTO service_resource (service_id, resource_id) VALUES 
-- Spălare Exterioară - poate fi făcută de Maria sau Andrei
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010'),
-- Spălare Completă - poate fi făcută de oricine
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012'),
-- Detailing Premium - doar Andrei (specialist)
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010'),
-- Curățare Interioară - Ion sau Andrei
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440012'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440010'),
-- Ceruire Auto - doar Andrei
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010');

-- Insert opening hours (Luni-Vineri: 8-18, Sâmbătă: 9-16, Duminică: închis)
INSERT INTO opening_hours (business_id, resource_id, day_of_week, start_time, end_time, is_active) VALUES 
-- Andrei - Luni-Vineri 8-18, Sâmbătă 9-16
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'monday', '08:00', '18:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'tuesday', '08:00', '18:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'wednesday', '08:00', '18:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'thursday', '08:00', '18:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'friday', '08:00', '18:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'saturday', '09:00', '16:00', true),

-- Maria - Luni-Sâmbătă 8-17
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', 'monday', '08:00', '17:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', 'tuesday', '08:00', '17:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', 'wednesday', '08:00', '17:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', 'thursday', '08:00', '17:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', 'friday', '08:00', '17:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', 'saturday', '08:00', '17:00', true),

-- Ion - Marți-Sâmbătă 9-17
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', 'tuesday', '09:00', '17:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', 'wednesday', '09:00', '17:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', 'thursday', '09:00', '17:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', 'friday', '09:00', '17:00', true),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', 'saturday', '09:00', '17:00', true);

-- Insert some demo customers
INSERT INTO customer (id, business_id, name, email, phone, license_plate, notes) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440000',
    'Popescu Ion',
    'ion.popescu@email.com',
    '+40 721 123 456',
    'B 123 ABC',
    'Client fidel, preferă servicii premium'
),
(
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ionescu Maria',
    'maria.ionescu@email.com',
    '+40 722 234 567',
    'B 456 DEF',
    'Vine lunar pentru spălare completă'
),
(
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440000',
    'Georgescu Andrei',
    'andrei.georgescu@email.com',
    '+40 723 345 678',
    'B 789 GHI',
    null
);

-- Insert some demo bookings (past, today, future)
INSERT INTO booking (id, business_id, customer_id, service_id, resource_id, starts_at, ends_at, status, notes) VALUES 
-- Past bookings
(
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440010',
    CURRENT_DATE - INTERVAL '2 days' + TIME '10:00',
    CURRENT_DATE - INTERVAL '2 days' + TIME '12:00',
    'completed',
    'Detailing complet BMW X5'
),
(
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440011',
    CURRENT_DATE - INTERVAL '1 day' + TIME '14:00',
    CURRENT_DATE - INTERVAL '1 day' + TIME '15:00',
    'completed',
    'Spălare completă Audi A4'
),

-- Today's bookings
(
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440011',
    CURRENT_DATE + TIME '09:00',
    CURRENT_DATE + TIME '09:30',
    'confirmed',
    'Spălare rapidă'
),
(
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440012',
    CURRENT_DATE + TIME '11:00',
    CURRENT_DATE + TIME '11:45',
    'confirmed',
    'Curățare interioară Mercedes'
),

-- Future bookings
(
    '550e8400-e29b-41d4-a716-446655440034',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440010',
    CURRENT_DATE + INTERVAL '1 day' + TIME '10:00',
    CURRENT_DATE + INTERVAL '1 day' + TIME '11:30',
    'pending',
    'Ceruire pentru Volkswagen Golf'
),
(
    '550e8400-e29b-41d4-a716-446655440035',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440010',
    CURRENT_DATE + INTERVAL '3 days' + TIME '13:00',
    CURRENT_DATE + INTERVAL '3 days' + TIME '15:00',
    'pending',
    'Detailing complet Toyota Prius'
);
