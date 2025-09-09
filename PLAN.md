# PLAN - Supabase Backend Implementation

## Scop
Implementare backend MVP conform README.md: Supabase schema, API routes, algoritm disponibilitate, fără modificări UI.

## Livrabile
1. **Environment Setup**: .env.local cu Supabase keys
2. **Database Schema**: 7 tabele + RLS + seed data  
3. **API Routes**: 4 endpoints publice
4. **Lib Functions**: availability.ts + supabaseClient.ts
5. **Types**: TypeScript definitions

## Pași Implementare (cu citări)

### 1. Environment Setup
- Configurare .env.local cu SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY
- [source: README.md, secțiunea 4 ".env.local"]

### 2. Database Schema & RLS
- Creare 7 tabele: business, service, resource, opening_hours, blackout, customer, booking
- Activare RLS pe booking și customer cu politici pentru authenticated
- Seed data: 1 business, servicii, resurse, program Lu-Du 08:00-18:00
- [source: README.md, secțiunea 5 "Schema SQL" + DB.md "RLS"]

### 3. Lib Functions
- `lib/supabaseClient.ts` - client Supabase server-side
- `lib/availability.ts` - algoritm calcul sloturi (pas 15min, validare coliziuni)
- `lib/types.ts` - TypeScript definitions
- [source: README.md, secțiunea 6 "Algoritm disponibilitate" + secțiunea 8]

### 4. API Routes
- `app/api/public/services/route.ts` - GET servicii active
- `app/api/public/availability/route.ts` - GET sloturi libere
- `app/api/public/bookings/route.ts` - POST creare rezervare
- `app/api/realtime-token/route.ts` - GET token efemer (TODO)
- [source: README.md, secțiunea 7 "Endpointuri" + API.md]

### 5. TypeScript Validation
- Verificare npm run typecheck
- [source: Agent_rules.md "Autoverificare"]

## Criterii Acceptare
- ✅ Schema SQL rulată în Supabase cu seed data
- ✅ RLS policies active pe booking/customer
- ✅ API routes funcționale: 200/400/409 responses
- ✅ Algoritm availability calculează sloturi corecte
- ✅ TypeScript fără erori
- ✅ Environment variables configurate

## Comenzi
```bash
# Nu rula - doar pentru referință
npm install @supabase/supabase-js zod
npm run typecheck
```

## Note
- UI deja terminat - nu se modifică
- Paginile /, /auth, /dashboard se fac mai târziu
- Focus strict pe backend/API conform README.md
