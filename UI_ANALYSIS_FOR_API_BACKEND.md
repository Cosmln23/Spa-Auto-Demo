# 📊 Analiza UI Dashboard - Plan pentru API și Backend

## 🎯 **Scopul documentului**

Această analiză detaliată a UI-ului actual servește pentru planificarea API-urilor și backend-ului cu agentul. Fiecare secțiune, buton, tabel și modal sunt documentate cu funcționalitățile necesare.

---

## 🏗️ **Arhitectura Generală**

### **Platforme suportate:**

- **Desktop** (`/desktop/dashboard`) - Layout cu sidebar collapsible
- **Mobile** (`/mobile/dashboard`) - Layout cu swipe navigation

### **State Management actual:**

- React hooks (`useState`, `useEffect`, `useMemo`)
- Date demo hardcodate în componente
- **NECESITĂ:** Integrare cu API real și state management global

---

## 📱 **1. HEADER - Informații Utilizator**

### **Desktop Header:**

```
[Toggle Sidebar] "Spa Auto Demo" - Owner dashboard    [🟢 21:09:45] [O owner@example.com]
```

### **Mobile Header:**

```
"Spa Auto Demo"                                       [🟢 21:09]
Owner dashboard                                       [O owner@example.com]
```

### **🔧 APIs necesare:**

- `GET /api/user/profile` - informații utilizator
- `GET /api/user/settings` - setări cont
- **Real-time clock** - nu necesită API

---

## 🧭 **2. NAVIGARE**

### **Desktop Sidebar:**

- **Collapsible** (toggle button)
- **Scrollspy** (highlight secțiunea activă)
- **7 secțiuni principale**

### **Mobile Menu:**

- **Swipe horizontal**
- **Click navigation**
- **Indicatori vizuali** (dots)

### **Secțiuni comune:**

1. **Rezervări** (`bookings`)
2. **Calendar** (`calendar`)
3. **Servicii** (`services`)
4. **Clienți** (`clients`)
5. **Program** (`program`)
6. **Istoric rezervări** (`history`)
7. **Setări** (`settings`)

---

## 📋 **3. SECȚIUNEA REZERVĂRI**

### **Tabel principal:**

| Coloană     | Tip    | Descriere                           |
| ----------- | ------ | ----------------------------------- |
| Nume        | string | Numele clientului                   |
| Serviciu    | string | Tipul serviciului                   |
| Ora         | string | Intervalul orar (ex: "10:00–10:20") |
| Tarif (RON) | number | Prețul serviciului                  |

### **Date demo actuale:**

```javascript
const todaysBookings = [
  {
    name: 'Andrei Pop',
    service: 'Spălare exterior',
    time: '10:00–10:20',
    price: 30,
  },
  {
    name: 'Maria Ionescu',
    service: 'Spălare completă',
    time: '12:30–13:15',
    price: 60,
  },
  {
    name: 'Ion Georgescu',
    service: 'Spălare exterior',
    time: '16:00–16:20',
    price: 30,
  },
];
```

### **🔧 APIs necesare:**

- `GET /api/bookings/today` - rezervările de astăzi
- `GET /api/bookings/date/{date}` - rezervări pentru o dată specifică
- `PUT /api/bookings/{id}/status` - actualizare status rezervare
- `DELETE /api/bookings/{id}` - anulare rezervare

### **Features necesare:**

- **Filtrare** pe dată
- **Sortare** după oră
- **Status management** (confirmată, anulată, completată)
- **Export** listă rezervări

---

## 📅 **4. SECȚIUNEA CALENDAR**

### **Componente:**

- **CalendarMonth** - vizualizare lună cu evenimente
- **AvailabilityList** - sloturile disponibile pentru o zi

### **Date demo actuale:**

```javascript
const eventsByDate = { [todayYmd]: 3 }; // 3 evenimente azi
const booked = ['10:00', '12:30']; // ore ocupate
```

### **🔧 APIs necesare:**

- `GET /api/calendar/month/{year}/{month}` - evenimente pentru lună
- `GET /api/availability/date/{date}` - disponibilitate pentru o zi
- `POST /api/bookings` - creare rezervare nouă
- `GET /api/working-hours` - programul de lucru

### **Features necesare:**

- **Drag & drop** pentru reprogramare
- **Conflicte** de rezervări
- **Recurring bookings** - rezervări recurente
- **Block time slots** - blocare intervale

---

## 🛠️ **5. SECȚIUNEA SERVICII**

### **Tabel principal:**

| Coloană      | Tip    | Descriere          |
| ------------ | ------ | ------------------ |
| Serviciu     | string | Numele serviciului |
| Preț (RON)   | number | Prețul serviciului |
| Durată (min) | number | Durata în minute   |

### **Date demo actuale:**

```javascript
const services = [
  { name: 'Spălare exterior', price: 30, duration: 20 },
  { name: 'Spălare completă', price: 60, duration: 45 },
];
```

### **Buton acțiune:**

- **"+ Adaugă serviciu"** → deschide modal

### **Modal "Adaugă serviciu":**

```
Denumire: [Input text] "Ex: Spălare interior"
Durată (min): [Input number] "30"
Preț (RON): [Input number] "50"
[Anulează] [Salvează]
```

### **🔧 APIs necesare:**

- `GET /api/services` - lista serviciilor
- `POST /api/services` - adaugă serviciu nou
- `PUT /api/services/{id}` - actualizează serviciu
- `DELETE /api/services/{id}` - șterge serviciu

### **Features necesare:**

- **Categorii** servicii
- **Pachete** de servicii
- **Discount-uri** și promoții
- **Servicii combo**

---

## 👥 **6. SECȚIUNEA CLIENȚI**

### **Tabel principal:**

| Coloană           | Tip    | Descriere                  |
| ----------------- | ------ | -------------------------- |
| Nume              | string | Numele clientului          |
| Email             | string | Adresa de email            |
| Telefon           | string | Numărul de telefon         |
| Adresă            | string | Adresa completă            |
| Nr. înmatriculare | string | Numărul mașinii (opțional) |

### **Date demo actuale:**

```javascript
const clients = [
  {
    name: 'Andrei Pop',
    email: 'andrei.pop@email.com',
    phone: '0721234567',
    address: 'Str. Florilor 12, București',
    plateNumber: 'B123ABC',
  },
  // ...
];
```

### **Buton acțiune:**

- **"+ Adaugă client"** → deschide modal

### **Modal "Adaugă client":**

```
Nume *: [Input text] "Ion Popescu"
Email *: [Input email] "ion@email.com"
Telefon *: [Input tel] "0721234567"
Nr. auto (opțional): [Input text] "B123ABC"
[Anulează] [Salvează]
```

### **🔧 APIs necesare:**

- `GET /api/clients` - lista clienților
- `GET /api/clients/search?q={query}` - căutare clienți
- `POST /api/clients` - adaugă client nou
- `PUT /api/clients/{id}` - actualizează client
- `DELETE /api/clients/{id}` - șterge client
- `GET /api/clients/{id}/history` - istoricul rezervărilor

### **Features necesare:**

- **Import/Export** CSV
- **Notificări** SMS/Email
- **Loyalty program**
- **Client notes** - notițe despre client

---

## ⏰ **7. SECȚIUNEA PROGRAM**

### **Tabel principal:**

| Coloană  | Tip    | Descriere         |
| -------- | ------ | ----------------- |
| Zi       | string | Ziua săptămânii   |
| Deschide | time   | Ora de deschidere |
| Închide  | time   | Ora de închidere  |

### **Date demo actuale:**

```javascript
const weeklyProgram = [
  { day: 'Luni', open: '08:00', close: '18:00' },
  { day: 'Marți', open: '08:00', close: '18:00' },
  // ... toate zilele săptămânii
];
```

### **Buton acțiune:**

- **"Editează program"** → deschide modal

### **Modal "Editează program":**

```
Tabel editabil cu input fields pentru fiecare zi:
Luni:    [08:00] - [18:00]
Marți:   [08:00] - [18:00]
...
[Anulează] [Salvează]
```

### **🔧 APIs necesare:**

- `GET /api/working-hours` - programul curent
- `PUT /api/working-hours` - actualizează programul
- `GET /api/working-hours/exceptions` - excepții (sărbători)
- `POST /api/working-hours/exceptions` - adaugă excepție

### **Features necesare:**

- **Pauze** în timpul zilei
- **Excepții** pentru sărbători
- **Program diferit** pe angajat
- **Overtime** - prelungire program

---

## 📈 **8. SECȚIUNEA ISTORIC REZERVĂRI**

### **Tabel principal:**

| Coloană  | Tip    | Descriere                     |
| -------- | ------ | ----------------------------- |
| Data     | date   | Data rezervării               |
| Ora      | time   | Ora rezervării                |
| Nume     | string | Numele clientului             |
| Serviciu | string | Tipul serviciului             |
| Status   | enum   | confirmată/anulată/completată |

### **Date demo actuale:**

```javascript
const history = [
  {
    date: '2024-01-15',
    time: '09:00',
    name: 'Elena D.',
    service: 'Spălare exterior',
    status: 'confirmată',
  },
  {
    date: '2024-01-15',
    time: '11:00',
    name: 'C. Mihai',
    service: 'Spălare completă',
    status: 'confirmată',
  },
  {
    date: '2024-01-15',
    time: '15:00',
    name: 'Radu P.',
    service: 'Spălare exterior',
    status: 'anulată',
  },
];
```

### **🔧 APIs necesare:**

- `GET /api/bookings/history?page={page}&limit={limit}` - istoric paginat
- `GET /api/bookings/history/export` - export CSV/PDF
- `GET /api/analytics/revenue?period={period}` - venituri pe perioadă
- `GET /api/analytics/services` - serviciile cele mai populare

### **Features necesare:**

- **Filtrare** pe dată, client, serviciu, status
- **Export** rapoarte
- **Analytics** și statistici
- **Revenue tracking**

---

## ⚙️ **9. SECȚIUNEA SETĂRI**

### **3 Sub-secțiuni:**

#### **9.1 Agent Settings:**

| Setare         | Tip     | Valoare Demo |
| -------------- | ------- | ------------ |
| Temperature    | float   | 0.2          |
| Max tool calls | integer | 8            |

#### **9.2 General Settings:**

| Setare   | Tip    | Valoare Demo     |
| -------- | ------ | ---------------- |
| Timezone | string | Europe/Bucharest |
| Valută   | string | RON              |

#### **9.3 User Settings:**

| Setare | Tip    | Valoare Demo      |
| ------ | ------ | ----------------- |
| Nume   | string | Owner Demo        |
| Email  | string | owner@example.com |

### **Buton acțiune:**

- **"Editează setări"** → deschide modal complex

### **Modal "Editează setări":**

```
[Agent]
Temperature: [0.2]
Max tool calls: [8]

[General]
Timezone: [Europe/Bucharest ▼]
Valută: [RON ▼]

[Utilizator]
Nume: [Owner Demo]
Email: [owner@example.com]

[Anulează] [Salvează]
```

### **🔧 APIs necesare:**

- `GET /api/settings` - toate setările
- `PUT /api/settings/agent` - setări agent
- `PUT /api/settings/general` - setări generale
- `PUT /api/settings/user` - setări utilizator
- `POST /api/settings/backup` - backup setări

---

## 🎨 **10. FEATURES UI SPECIALE**

### **10.1 Scrollbar Custom:**

- **Gradient cyan-blue** (`#06b6d4` → `#3b82f6`)
- **Hover effects**
- **Compatibilitate** WebKit + Firefox

### **10.2 Responsive Design:**

- **Desktop:** Sidebar + grid layout
- **Mobile:** Swipe navigation + stacked layout

### **10.3 Real-time Features:**

- **Live clock** în header
- **Auto-refresh** pentru rezervări
- **WebSocket** pentru notificări (FUTURE)

---

## 🔄 **11. INTEGRĂRI NECESARE**

### **11.1 Supabase Integration:**

- **Authentication** - login/logout
- **Database** - PostgreSQL pentru toate datele
- **Real-time** - subscriptions pentru updates
- **Storage** - pentru fișiere și backup-uri

### **11.2 OpenAI Realtime API:**

- **Voice bookings** - rezervări prin voce
- **AI assistant** - răspunsuri automate
- **Natural language** - procesare comenzi vocale

### **11.3 External APIs:**

- **SMS notifications** - confirmare rezervări
- **Email service** - confirmări și reminder-uri
- **Payment gateway** - plăți online (FUTURE)
- **Google Calendar** - sincronizare (FUTURE)

---

## 📊 **12. STRUCTURA DATABASE**

### **12.1 Tabele principale:**

```sql
-- Users (business owners)
users: id, email, name, phone, created_at, settings

-- Services
services: id, user_id, name, price, duration, active, created_at

-- Clients
clients: id, user_id, name, email, phone, address, plate_number, created_at

-- Bookings
bookings: id, user_id, client_id, service_id, date, start_time, end_time,
          status, price, notes, created_at

-- Working Hours
working_hours: id, user_id, day_of_week, open_time, close_time, active

-- Working Hour Exceptions
working_hour_exceptions: id, user_id, date, open_time, close_time, reason
```

### **12.2 Relații:**

- `users` 1:N `services, clients, bookings, working_hours`
- `clients` 1:N `bookings`
- `services` 1:N `bookings`

---

## 🚀 **13. PLAN IMPLEMENTARE**

### **Faza 1 - Core APIs:**

1. ✅ User authentication & profile
2. ✅ Services CRUD
3. ✅ Clients CRUD
4. ✅ Basic bookings CRUD

### **Faza 2 - Advanced Features:**

1. ✅ Calendar integration
2. ✅ Working hours management
3. ✅ Analytics & reporting
4. ✅ Settings management

### **Faza 3 - AI Integration:**

1. ✅ Voice booking system
2. ✅ AI assistant responses
3. ✅ Automated notifications
4. ✅ Smart scheduling

### **Faza 4 - Optimization:**

1. ✅ Real-time updates
2. ✅ Performance optimization
3. ✅ Mobile app (React Native)
4. ✅ Advanced analytics

---

## 📝 **14. NOTES pentru AGENT**

### **Priorități:**

1. **Authentication** și **user management** - CRITICAL
2. **Bookings system** - CORE FEATURE
3. **Services & Clients** - ESSENTIAL
4. **Calendar integration** - HIGH PRIORITY
5. **AI Voice features** - DIFFERENTIATOR

### **Considerații tehnice:**

- **Timezone handling** - important pentru booking-uri
- **Conflict detection** - evitare double-booking
- **Data validation** - input sanitization
- **Error handling** - user-friendly messages
- **Performance** - lazy loading pentru liste mari

### **Security:**

- **Rate limiting** pe API-uri
- **Input validation** pe toate endpoint-urile
- **Authentication** pe toate rutele protejate
- **GDPR compliance** pentru date clienți

---

## ✅ **READY FOR BACKEND PLANNING!**

Acest document oferă o imagine completă a UI-ului actual și a funcționalităților necesare. Poți folosi aceste informații pentru a planifica cu agentul:

1. **Database schema**
2. **API endpoints**
3. **Business logic**
4. **Integration points**
5. **Security requirements**

**Toate detaliile sunt aici - gata pentru următorul pas! 🎯**
