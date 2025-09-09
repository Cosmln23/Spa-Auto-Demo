# PLAN – 0002: Structură + UI → DB (macro)

## Scop
Stabilesc structura aplicației și UI-ul de bază, apoi conectez UI la DB și API în pași mici, validați cu tine între etape.

## Etape (macro)
1) Schelet App (layout + pagini stub + formular fallback)
2) Supabase & DB (env + client + SQL în Documentatie)
3) API public (services, availability, bookings, realtime-token [TODO])
4) Conectare UI ↔ API (formular public + dashboard read-only)
5) Auth (owner) + guard la /dashboard
6) Voice Widget (WebRTC) + CTA
7) Agent guardrails (tool schemas + prompt)
8) Documentație finală (Documentatie/* actualizată)

## Pași activi (Faza 1 – Schelet App)
- Creez `app/layout.tsx` (include `app/globals.css`).
- Creez stub pagini: `app/auth/page.tsx`, `app/dashboard/page.tsx` (UI simplu în română).
- Creez `components/ManualBookingForm.tsx` (MVP, fără logică – pentru validare UI).

## Livrabile Faza 1
- `app/layout.tsx`, `app/auth/page.tsx`, `app/dashboard/page.tsx`, `components/ManualBookingForm.tsx`.

## Verificare UI
- După Faza 1, revizuim vizual UI cu tine (ce păstrăm/ajustăm) înainte de legarea la API.

## Documente-sursă citate
- [source: README.md, "Structura proiectului / MVP"]
- [source: UI.MD, "Interfața Aura – CSS și Screens"]
- [source: Documentatie/API.md, "Route Handlers"]

## Criterii de acceptare (Faza 1)
- Fișierele listate există, stilul global e aplicat prin layout.
- Paginile se încarcă ca componente valide; formularul afișează câmpurile necesare (fără submit logic).

## Note execuție
- Fără testare/rulare până la cererea ta explicită. Execut doar fișierele din această fază.
