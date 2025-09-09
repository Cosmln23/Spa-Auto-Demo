# PLAN – 0001: Bootstrap „B-A-W” (Next.js + Tailwind + Aura UI)

## Scop
Inițializez structura proiectului „B-A-W” (Next.js App Router, TypeScript, Tailwind) și UI de bază „Aura Neon” pe mobil/desktop, fără rețea.

## Livrabile
- [ ] Config inițial: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `.gitignore`, `.env.example`
- [ ] Stil global: `app/globals.css` cu animații/utilitare „Aura Neon”
- [ ] Componente: `components/PhoneFrame.tsx`, `components/NeonButton.tsx`
- [ ] Ecrane: `components/screens/{OnboardingScreen,DashboardScreen,LiveListeningScreen}.tsx`
- [ ] Pagină publică: `app/(public)/page.tsx` (grid telefoane + CTA)
- [ ] Documentație locală: `Documentatie/*` (fișiere ghid scurte)

## Documente-sursă citate
- [source: README.md, "Structura proiectului / MVP"]
- [source: UI.MD, "Interfața Aura – layout și butoane"]
- [source: docs/doc_002.html, "Next.js App Router"]
- [source: docs/doc_006.html, "Edge și Node runtimes"]
- [source: docs/doc_005.html, "Config: environment variables"]
- [source: docs/doc_014.html, "Realtime Guide"]
- [source: docs/doc_015.html, "Realtime WebRTC"]

## Pași (ordonați, finiți)
1) Creez fișierele de configurare de bază (`package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `.gitignore`, `.env.example`). — [source: docs/doc_005.html, "Environment Variables"]
2) Adaug `app/globals.css` cu animațiile/utilitare „Aura Neon” din UI (neonPulse, entranceSlideUp, .neon-border, .aura-blob). — [source: UI.MD, "CSS & efecte"]
3) Componente UI: `PhoneFrame.tsx` și `NeonButton.tsx` conform schițelor. — [source: UI.MD, "PhoneFrame / NeonButton"]
4) Ecrane: `OnboardingScreen`, `DashboardScreen`, `LiveListeningScreen` (texte RO). — [source: UI.MD, "Screens"]
5) Pagina publică `app/(public)/page.tsx`: grid 1/2/3 „telefoane”, CTA global (id="activate"). — [source: UI.MD, "Public page"]
6) Documentație scurtă în `Documentatie/` (Arhitectura.md, UI.md, API.md – stub, DB.md – stub). — [source: README.md, "Arhitectură & Endpointuri"]

## Criterii de acceptare
- [ ] Fișierele enumerate există și se pot deschide
- [ ] CSS global include animațiile și clasele din UI
- [ ] Componentele și ecranele compilează tipic (fără dependințe externe)
- [ ] Pagina publică exportă un component valid
- [ ] Nicio dependență rețea necesară pentru a vedea structura în editor

## Verificări / Comenzi (de rulat local, după instalarea deps)
- `npm run typecheck`
- `npm run lint`
- `npm run dev`

## Riscuri / Fallback
- Dacă lipsesc detalii critice din doc: răspunde NECOVERIT și cere clarificare.
