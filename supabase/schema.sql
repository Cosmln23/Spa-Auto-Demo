-- Schema SQL pentru Supabase MVP
-- [source: README.md, secțiunea 5 "Schema SQL (Supabase / Postgres)"]

-- business (1 rând în MVP)
create table if not exists business (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tz text not null default 'Europe/Bucharest'
);

-- service
create table if not exists service (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business(id) on delete cascade,
  name text not null,
  duration_min int not null check (duration_min > 0),
  price_cents int not null default 0,
  is_active boolean not null default true
);

-- resource (boxe)
create table if not exists resource (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business(id) on delete cascade,
  name text not null,
  capacity int not null default 1 check (capacity > 0)
);

-- opening hours (recurrence simplă)
create table if not exists opening_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6), -- 0=Mon
  open_time time not null,
  close_time time not null
);

-- blackout (excepții)
create table if not exists blackout (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text
);

-- customer
create table if not exists customer (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  name text,
  email text
);

create unique index if not exists customer_phone_idx on customer(phone);

-- booking
create table if not exists booking (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business(id) on delete cascade,
  customer_id uuid not null references customer(id),
  service_id uuid not null references service(id),
  resource_id uuid not null references resource(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed', -- confirmed|cancelled
  notes text,
  created_at timestamptz not null default now(),
  unique(business_id, resource_id, starts_at)
);

-- RLS (Row Level Security)
-- [source: README.md, secțiunea 5 "RLS (minim sigur)" + DB.md "RLS"]

-- activează RLS
alter table booking enable row level security;
alter table customer enable row level security;

-- politici: owner (authenticated) poate citi tot
create policy booking_owner_read on booking
for select to authenticated using (true);

create policy customer_owner_read on customer
for select to authenticated using (true);

-- Inserarea de booking DOAR prin funcția securizată (endpoint server-side)
-- Nu adăugăm policy directă de insert pentru anon
