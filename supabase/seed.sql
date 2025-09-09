-- Seed data pentru MVP
-- [source: README.md, secțiunea 5 "Seed de bază"]

insert into business (name) values ('Spa Auto Demo') on conflict do nothing;

-- servicii
insert into service (business_id, name, duration_min, price_cents)
select id, 'Spălare exterior', 20, 3000 from business limit 1;

insert into service (business_id, name, duration_min, price_cents)
select id, 'Spălare completă', 45, 6000 from business limit 1;

-- resurse
insert into resource (business_id, name, capacity)
select id, 'Boxa 1', 1 from business limit 1;

insert into resource (business_id, name, capacity)
select id, 'Boxa 2', 1 from business limit 1;

-- program (Lu–Du 08:00–18:00)
insert into opening_hours (business_id, weekday, open_time, close_time)
select id, d, '08:00', '18:00' from business, generate_series(0,6) as d;
