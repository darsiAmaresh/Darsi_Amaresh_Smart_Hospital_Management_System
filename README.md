# SmartCare HMS — Smart Hospital Management System

A production-style **React** hospital management platform with role-based access, dynamic dashboards, patient/doctor modules, appointments, pharmacy & billing, and AI health analytics.

## Tech Stack

- **React 19** (functional components & hooks)
- **Vite** — fast dev server & build
- **React Router** — navigation & protected routes
- **Context API + useReducer** — global state
- **Recharts** — interactive charts
- **date-fns** — date formatting
- **lucide-react** — icons
- **Local Storage** — persistence (mock backend)

## Features

| Module | Capabilities |
|--------|-------------|
| **Authentication** | Login, multi-step signup, 4 roles, protected routes, session UI |
| **Admin Dashboard** | Stats, charts, activity feed, emergencies, daily reports, widget customization |
| **Patients** | CRUD, medical history, prescriptions, search/filter, infinite scroll, emergency contacts |
| **Doctors** | Profiles, departments, availability toggle, consultation history |
| **Appointments** | Booking, approval workflow, calendar, time slots, notifications |
| **Pharmacy & Billing** | Inventory, invoices, payment tracking, revenue reports |
| **AI Analytics** | Health monitoring, disease stats, risk indicators, recommendations |
| **UI/UX** | Dark/light mode, collapsible sidebar, toasts, modals, skeletons, animations |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | darsi123@gmail.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Receptionist | reception@hospital.com | reception123 |
| Patient | patient@hospital.com | patient123 |

## Project Structure

```
src/
├── components/     # Reusable UI, layout, charts
├── contexts/       # Auth, Theme, Toast, Hospital (reducer)
├── hooks/          # useLocalStorage, useDebounce, useInfiniteScroll
├── pages/          # Feature pages (lazy-loaded)
├── routes/         # App routing
├── services/       # Storage & mock API
└── data/           # Seed data
```

## Build

```bash
npm run build
npm run preview
```

## Architecture Highlights

- **Lazy loading** — route-based code splitting
- **Error boundary** — graceful error recovery
- **Custom hooks** — reusable logic
- **useMemo / useReducer / useContext** — optimized state
- **Role-based navigation** — dynamic sidebar per role

---

Built for enterprise healthcare UI/UX demonstration using React-only frontend architecture.
