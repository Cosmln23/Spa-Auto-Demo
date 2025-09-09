# DB – Schema & RLS (MVP)

- Tabele: `business`, `service`, `resource`, `opening_hours`, `blackout`, `customer`, `booking`.
- Seed: 1 business, servicii, resurse, program Luni–Duminică 08–18.
- RLS: select pentru `booking` și `customer` doar pentru `authenticated`; inserarea de booking prin endpoint server-side.

[sources: README.md secțiunea 5, RLS secțiunea 5/7; docs/doc_022.html "Row Security"; docs/doc_023.html "CREATE POLICY"]
