# Arhitectura MVP „B-A-W”

- Stack: Next.js 14 (App Router, TypeScript, Tailwind)
- Backend: Supabase (Auth + Postgres + RLS)
- Voce: OpenAI Realtime API (WebRTC)
- Hosting: Vercel (app + API), Supabase (DB/Auth)

Puncte cheie (MVP):
- Trei pagini: `/`, `/auth`, `/dashboard`.
- API public: services, availability, bookings; token efemer pentru Realtime.
- Guardrails pentru agent: domeniu limitat, confirmare, fără inventat sloturi.

[source: README.md, "Structura proiectului / MVP"]
