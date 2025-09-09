# API – Route Handlers (MVP)

Public (server-side):

- `GET /api/public/services` – listează serviciile active
- `GET /api/public/availability` – sloturi libere pentru un serviciu/zi
- `POST /api/public/bookings` – creează rezervare (coliziuni minime)
- `GET /api/realtime-token` – token efemer pentru Realtime (TODO)

Note runtime: Node.js pentru route handlers.

[sources: README.md secțiunea 7; docs/doc_003.html "Route Handlers"; docs/doc_004.html "Route Handlers & Middleware"]
