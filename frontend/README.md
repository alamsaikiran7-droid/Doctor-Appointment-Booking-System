# NovaCare Hospitals — Frontend

Frontend module (Member 4) for the **Doctor Appointment Booking System**, built for
NovaCare Hospitals. React 18 + Vite + Tailwind CSS + React Router.

This app is fully demoable on its own using mock data (`src/data`, `localStorage`).
Every service in `src/services` is written to call the real FastAPI backend first and
silently fall back to mock data if the request fails — so no code changes are needed
when Members 1–3 finish the backend, only setting `VITE_API_URL` in `.env`.

## 1. Requirements

- Node.js 18+ and npm 9+ (check with `node -v` and `npm -v`)

## 2. Install & Run

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**.

## 3. Connect to the backend later

```bash
cp .env.example .env
# edit .env → VITE_API_URL=http://localhost:8000 (or your deployed API URL)
```

No other code changes are required — `src/services/api.js` reads this variable.

## 4. Project Structure

```
frontend/
├── src/
│   ├── assets/                Images / static assets
│   ├── components/            Shared UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── DoctorCard.jsx
│   │   ├── LoginRoleModal.jsx
│   │   ├── RegisterRoleModal.jsx
│   │   ├── Features.jsx
│   │   ├── SpecialtyGrid.jsx
│   │   ├── CareTimeline.jsx
│   │   ├── BookingWidget.jsx
│   │   ├── StatBar.jsx
│   │   ├── EmergencyBanner.jsx
│   │   ├── SectionHeading.jsx
│   │   └── dashboard/
│   │       ├── Sidebar.jsx
│   │       ├── Topbar.jsx
│   │       └── StatCard.jsx
│   ├── layouts/
│   │   ├── MainLayout.jsx     Navbar + Footer wrapper (public pages)
│   │   └── DashboardLayout.jsx Sidebar + Topbar wrapper (patient/doctor/admin)
│   ├── pages/
│   │   ├── Home.jsx, About.jsx, Contact.jsx
│   │   ├── Doctors.jsx, DoctorProfile.jsx, Booking.jsx, MyAppointments.jsx
│   │   ├── Login.jsx, Register.jsx        (reusable, driven by /:role)
│   │   └── PatientDashboard.jsx, DoctorDashboard.jsx, AdminDashboard.jsx
│   ├── routes/AppRoutes.jsx    All route definitions
│   ├── services/                Axios calls mapped to the FastAPI contracts
│   │   ├── api.js, authService.js, doctorService.js, appointmentService.js
│   ├── context/AuthContext.jsx  Logged-in user + role state
│   ├── hooks/useAuth.js, useScrollReveal.js
│   ├── utils/storage.js, slots.js
│   └── data/doctors.js, specialties.js   Mock data (safe to delete once backend is live)
├── index.html
├── tailwind.config.js
├── package.json
└── vite.config.js
```

## 5. How auth & routing work

- **Login/Register** use one reusable page each (`Login.jsx`, `Register.jsx`) driven by
  the `:role` URL param — `/login/patient`, `/login/doctor`, `/login/admin`, and the
  same pattern under `/register/:role`.
- Clicking **Login** or **Register** in the navbar opens a role-selection modal
  (`LoginRoleModal.jsx` / `RegisterRoleModal.jsx`), which routes to the correct URL.
- After login, `AuthContext` stores the user and role; dashboards read `useAuth()` to
  personalize the greeting and sidebar menu.

## 6. API contracts this frontend expects (from the team task doc)

| Feature | Method & Path |
|---|---|
| Register | `POST /auth/register` |
| Login | `POST /auth/login` |
| Profile | `GET /auth/profile` |
| List doctors | `GET /doctors` |
| Doctor detail | `GET /doctors/{id}` |
| Doctor slots | `GET /slots/{doctor_id}` |
| Book appointment | `POST /appointments` |
| Patient's appointments | `GET /appointments/{patient_id}` |
| Cancel appointment | `PUT /appointments/{id}/cancel` |
| Complete appointment | `PUT /appointments/{id}/complete` |

## 7. Design system

- **Colors** — deep teal primary (`#0E7C66`), coral accent (`#FF6B4A`) for emergency/CTA
  moments, warm gold for ratings, cool mint-white background. Defined in
  `tailwind.config.js`.
- **Type** — `Newsreader` (serif/italic) for display headings, `Inter` for body & UI,
  `IBM Plex Mono` for stats, prices and eyebrow labels.
- **Signature element** — the "Care Timeline" on the Home page (`CareTimeline.jsx`)
  visualizes the patient journey as a connected rail instead of generic numbered cards.

## 8. Scope note (frontend-only)

Per the team task distribution, this module owns `frontend/src/pages`,
`frontend/src/components` and `frontend/src/services` only — no backend logic lives
here. All persistence currently uses `localStorage` as a stand-in for the database
until Members 1–3's APIs are live.
