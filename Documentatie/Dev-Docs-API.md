# Server local pentru documentații (dev-only)

Server Node.js separat (în `Documentatie/docs/local-server.js`) care expune documentația locală din `./Documentatie/docs` pentru listare/citire/căutare, exclusiv în dezvoltare. Nu afectează aplicația Next.js.

- Binar: `node Documentatie/docs/local-server.js`
- Port implicit: `4010` (se poate schimba cu `LOCAL_DOCS_PORT`)
- Sursă: fișiere `doc_XXX.html` din `./Documentatie/docs` și maparea din `Documentatie/docs/README.md`

Endpoint-uri
- `GET /list`
  - Returnează: `{ total, items: { id, file, title, subject?, url?, sizeBytes }[] }`
  - `title` extras din `<title>` (fallback nume fișier)
  - `subject` și `url` extrase din `Documentatie/docs/README.md` dacă există (format: `- doc_001.html — Subiect — https://...`)

- `GET /get?id=doc_XXX[&mode=html|text]`
  - `mode=text` (implicit): `{ content_text }` (HTML curățat de tag-uri/script/style)
  - `mode=html`: `{ content_html }` (HTML brut din fișier)
  - Validare `id` cu regex `^doc_\d{3}$`

- `GET /search?q=...`
  - Caută case-insensitive în textul HTML curățat
  - Returnează top rezultate cu `{ id, file, title, score, snippet }`
  - `snippet` ≈ 240 caractere în jurul primei potriviri

Pornire (dev)
- `npm run docs:server` (ascultă pe `http://localhost:4010`)
- Exemplu:
  - `http://localhost:4010/list`
  - `http://localhost:4010/get?id=doc_014`
  - `http://localhost:4010/get?id=doc_014&mode=html`
  - `http://localhost:4010/search?q=Route%20Handlers`

Motivație
- Izolare completă: server separat, fără coliziune cu rutele aplicației Next
- Fără web: consumă exclusiv fișierele locale din `./Documentatie/docs`
