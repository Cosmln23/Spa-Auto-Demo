# Agent Rules (hard)

Obiectiv: agentul construiește MVP-ul “B-A-W” fără halucinații, folosind exclusiv documentațiile locale și regulile de mai jos.

- Reguli explicite de execuție (cerute):
  - Nu halucina. Dacă nu ești 100% sigur, te oprești și întrebi.
  - Nu testezi și nu rulezi verificări decât dacă ți se cere explicit. Notează-le ca TODO.
  - Lucrezi cu precizie chirurgicală. Faci doar ceea ce ți se cere, nimic extra.
  - Prezinți planul înainte de orice modificare. Aștepți aprobare.
  - La orice eroare te oprești și prezinți pe scurt problema (fără a persista în încercări).

- Domeniu: programări spălătorie auto. Fără prețuri/discounturi noi. Fără anulări (nu există tool dedicat).
- Fără web: nu folosi browsing extern. Dacă lipsește o informație critică, răspunde exact: NECOVERIT.
- Izolare docs: consumă doar fișierele din `Documentatie/` și din repo (ex.: `README.md`, `UI.MD`).

Permis – Tool-uri (dev only; server separat docs în `Documentatie/docs/local-server.js`)
- list_docs()  → `GET http://localhost:4010/list`
- search_docs({ query }) → `GET http://localhost:4010/search?q=...`
- get_doc({ id, mode? }) → `GET http://localhost:4010/get?id=doc_XXX&mode=text|html`
Fallback dacă serverul docs nu rulează: citește direct `Documentatie/docs/README.md` și fișierele `Documentatie/docs/doc_XXX.html` de pe disc (fără rețea).

Ordine obligatorie de lectură (start fiecare task)
1) `README.md` (rădăcină) și `readme.md` (dacă există separat)
2) `UI.MD`
3) Toate fișierele `Documentatie/*.md`
4) `Documentatie/docs/README.md` (index doc_XXX)
5) Doc-check pe serverul local de docs (dacă rulează):
   - Listează primele 10: `GET http://localhost:4010/list`
   - Caută 2–3 termeni (ex.: “Route Handlers”, “RLS”, “WebRTC”)
6) Rezumat de înțelegere în 5 linii (fără idei noi).

Format citare (obligatoriu)
- Pentru fiecare decizie tehnică: `[source: Documentatie/docs/doc_014.html, "Realtime Guide"]` sau `[source: Documentatie/DB.md, "RLS"]` sau `[source: README.md, "Arhitectură MVP"]`.
- Minim 1 citare per pas în PLAN.md și în OUTPUT.md pentru fiecare schimbare majoră.

Format execuție (pipeline)
1) Încarcă regulile: citește acest fișier și listează exact tool-urile permise + formatul de citare.
2) Doc-check: list + 2 căutări; notează sursele folosite.
3) PLAN.md: completează scop, livrabile, pași (cu citări), criterii acceptare, comenzi.
4) Execuție: respectă strict pașii aprobați; fără modificări în afara planului.
5) Autoverificare: NU rula verificări (typecheck, lint, test) decât dacă este cerut explicit; altfel marchează TODO.
6) OUTPUT.md: diffs (fișiere), comenzi rulate, rezultate, erori, surse citate, next step.

Guardrails suplimentare
- Temperature 0.2; top_p ≤ 0.9 (dacă este relevant pentru agentul Realtime).
- Max 3 rezultate pe căutare; preferă documentația oficială (Next.js, Supabase, OpenAI, MDN, PostgreSQL, Vercel).
- Nu continua dacă o secțiune critică e “NECOVERIT”; cere clarificare sau notează fallback în PLAN.md.

Criterii de acceptare (per task)
- Sumar de 5 linii din `README.md` fără idei noi.
- Tool-urile permise listate corect.
- Doc-check efectuat (listare + 2 căutări) cu citări.
- PLAN.md aprobat: pași cu citări, criterii clare, comenzi definite.
- OUTPUT.md cu surse citate și rezultate verificabile.
