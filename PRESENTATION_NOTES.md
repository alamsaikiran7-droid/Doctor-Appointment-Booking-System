# Doctor Appointment Booking System - Presentation Guide

## Overview
**Project Name:** NovaCare Hospitals - Doctor Appointment Booking System
**Tech Stack:** React + Vite (Frontend) | FastAPI + PostgreSQL (Backend) | JWT Authentication

---

## 1. HOW FRONTEND AND BACKEND COMMUNICATE

### Communication Architecture

```
Frontend (React)  ←→  REST API (HTTP/HTTPS)  ←→  Backend (FastAPI)
    ↓                                                ↓
  Axios                                          PostgreSQL
  localStorage (JWT)                            Database
```

### Communication Flow - Step by Step

#### **A. Request Flow**

1. **User Action** → User clicks login, book appointment, etc.
2. **Service Layer** → `authService.js`, `appointmentService.js` prepare data
3. **Data Adaptation** → `adapters.js` transforms frontend data to backend format
4. **Axios HTTP Request** → Sends to backend with JWT token
5. **Backend Processing** → FastAPI receives, validates, processes
6. **Database Query** → PostgreSQL stores/retrieves data
7. **Response** → Backend sends JSON response

#### **B. Response Flow**

1. **Backend Response** → Returns JSON data
2. **Error Handling** → Check status codes
3. **Data Adaptation** → `adapters.js` transforms backend data to frontend shape
4. **State Update** → React Context/State updates
5. **UI Re-render** → Component displays new data

### API Communication Details

#### **Base URL Configuration**
```javascript
// frontend/src/services/api.js
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000"
```
- **Development:** `http://localhost:8000`
- **Production:** Set via environment variable `VITE_API_URL`

#### **JWT Authentication**
```javascript
// Automatically attached to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("novacare_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
- Token stored in `localStorage` after login
- Automatically sent in `Authorization: Bearer <token>` header
- Backend verifies token for protected endpoints

#### **Data Format**
- **Request/Response Format:** JSON
- **Content-Type:** `application/json`
- **Authentication:** Bearer token in headers

---

## 2. HOW THE FRONTEND WAS CREATED

### Frontend Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| Vite | 5.4.8 | Build tool & dev server |
| React Router | 6.26.2 | Client-side routing |
| Axios | 1.7.7 | HTTP client for API calls |
| TailwindCSS | 3.4.13 | Utility-first CSS styling |
| PostCSS | 8.4.47 | CSS processing |
| React Icons | 5.7.0 | Icon library |

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   ├── BookingWidget.jsx
│   ├── DoctorCard.jsx
│   ├── Navbar.jsx
│   ├── LoginRoleModal.jsx
│   └── dashboard/
│       ├── Sidebar.jsx
│       ├── Topbar.jsx
│       └── StatCard.jsx
├── pages/              # Page components (route handlers)
│   ├── Login.jsx
│   ├── Booking.jsx
│   ├── Home.jsx
│   ├── PatientDashboard.jsx
│   ├── DoctorDashboard.jsx
│   └── AdminDashboard.jsx
├── services/           # API communication layer
│   ├── api.js         # Axios instance with interceptors
│   ├── authService.js  # Auth API calls
│   ├── appointmentService.js
│   ├── doctorService.js
│   └── adapters.js    # Data transformation layer
├── context/            # State management
│   └── AuthContext.jsx # Authentication state
├── hooks/              # Custom React hooks
│   ├── useAuth.js     # Auth hook
│   └── useScrollReveal.js
├── layouts/            # Layout wrappers
│   ├── MainLayout.jsx
│   └── DashboardLayout.jsx
├── routes/             # Route configuration
│   └── AppRoutes.jsx
├── utils/              # Utility functions
│   ├── storage.js     # localStorage helpers
│   └── slots.js       # Appointment slot logic
├── data/               # Static data
│   ├── doctors.js
│   └── specialties.js
└── styles/
    └── index.css
```

### Key Features Implemented

#### **1. Authentication System**
- **Role-based login** (Patient, Doctor, Admin)
- **JWT token storage** in localStorage
- **Auto-login** from stored token
- **Protected routes** with authentication guards

#### **2. API Integration Layer**
```javascript
// Service method example:
export async function login({ role, username, password }) {
  try {
    const { data } = await api.post("/auth/login", 
      { role, username, password }
    );
    localStorage.setItem("novacare_token", data.token);
    const user = adaptUser(data.user || data);
    setUser(user);
    return user;
  } catch (err) {
    // Graceful fallback with mock data while backend is in development
    const mockUser = { name: username, role, username };
    localStorage.setItem("novacare_token", "mock-token");
    setUser(mockUser);
    return mockUser;
  }
}
```

#### **3. Data Adaptation Layer (Crucial!)**
The `adapters.js` file transforms data between frontend and backend formats:

```javascript
// Backend → Frontend (Inbound)
export function adaptUser(backend) {
  return {
    id: backend.id ?? backend.user_id,
    name: backend.full_name || backend.name,
    email: backend.email,
    role: backend.role,
  };
}

// Frontend → Backend (Outbound)
export function adaptUserForBackend(frontend) {
  return {
    id: frontend.id,
    full_name: frontend.name,
    email: frontend.email,
    role: frontend.role,
  };
}
```

**Why adapters?** Backend field names may differ (e.g., `full_name` vs `name`, `speciality` vs `specialization`). Adapters normalize both directions.

#### **4. State Management**
```javascript
// AuthContext provides global auth state
<AuthProvider>
  <App />
</AuthProvider>

// Access anywhere in app:
const { user, login, logout, loading } = useAuth();
```

#### **5. Dashboard Layouts**
- **Patient Dashboard:** View appointments, book new ones
- **Doctor Dashboard:** Manage schedule, view patient appointments
- **Admin Dashboard:** Manage doctors, patients, generate reports

#### **6. Component Design**
- **Card-based layouts** for doctors (DoctorCard.jsx)
- **Modal dialogs** for login/registration (LoginRoleModal.jsx)
- **Responsive design** with TailwindCSS (mobile-first)
- **Icon system** with react-icons

### Development Workflow

#### **Running the Frontend**
```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

#### **Build Process (Vite)**
- **Development:** Hot Module Replacement (HMR) for instant updates
- **Production:** Optimized bundle with tree-shaking
- **Port:** 5173 (dev), configured in `vite.config.js`

### Design Approach

1. **Component Reusability** - StatCard, DoctorCard, etc. used in multiple pages
2. **Service Abstraction** - All API calls go through service layer
3. **Error Handling** - Try/catch with graceful fallbacks to mock data
4. **Performance** - React lazy loading for routes
5. **UX First** - Role-based dashboards, intuitive navigation

---

## 3. REQUIREMENTS GIVEN TO BACKEND DEVELOPER

### Backend Tech Stack Specified
- **Framework:** FastAPI (modern Python framework)
- **Database:** PostgreSQL (relational database)
- **Authentication:** JWT tokens
- **ORM:** SQLAlchemy

### API Endpoints Required

#### **Authentication Endpoints** (Member 1)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login (returns JWT token) | No |
| GET | `/auth/profile` | Get current user profile | Yes |

**Request/Response Examples:**

```javascript
// Login Request
POST /auth/login
{
  "role": "patient",
  "username": "john_doe",
  "password": "secure_password"
}

// Login Response
{
  "token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

```javascript
// Register Request
POST /auth/register
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secure_password",
  "role": "patient"
}
```

#### **Appointment Endpoints** (Member 3)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| POST | `/appointments` | Book appointment | Yes |
| GET | `/appointments/{patient_id}` | Get patient's appointments | Yes |
| PUT | `/appointments/{id}/cancel` | Cancel appointment | Yes |
| PUT | `/appointments/{id}/complete` | Mark appointment complete | Yes |

**Request/Response Examples:**

```javascript
// Book Appointment Request
POST /appointments
{
  "patient_id": 1,
  "patient_name": "John Doe",
  "doctor_id": 5,
  "doctor_name": "Dr. Smith",
  "specialization": "Cardiology",
  "appointment_date": "2024-12-25",
  "appointment_time": "14:30",
  "notes": "Regular checkup"
}

// Appointment Response
{
  "id": 101,
  "patient_id": 1,
  "doctor_id": 5,
  "appointment_date": "2024-12-25",
  "appointment_time": "14:30",
  "status": "BOOKED",
  "notes": "Regular checkup"
}
```

```javascript
// Get Appointments
GET /appointments/1

// Response - Array of appointments
[
  {
    "id": 101,
    "patient_id": 1,
    "patient_name": "John Doe",
    "doctor_id": 5,
    "doctor_name": "Dr. Smith",
    "specialization": "Cardiology",
    "appointment_date": "2024-12-25",
    "appointment_time": "14:30",
    "status": "BOOKED",
    "notes": "Regular checkup"
  }
]
```

#### **Doctor Endpoints** (Member 2)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| GET | `/doctors` | Get all doctors | No |
| GET | `/doctors/{id}` | Get doctor details | No |
| GET | `/doctors/speciality/{speciality}` | Filter by specialty | No |
| PUT | `/doctors/{id}` | Update doctor profile | Yes |

**Expected Response Format:**

```javascript
{
  "id": 5,
  "name": "Dr. Ahmed Smith",
  "email": "dr.smith@hospital.com",
  "speciality": "Cardiology",
  "city": "New York",
  "experience_years": 10,
  "consultation_fee": 150,
  "rating": 4.8,
  "reviews": 45,
  "bio": "Expert cardiologist with 10 years of experience",
  "education": ["MD", "Board Certified"],
  "languages": ["English", "Spanish"]
}
```

#### **Slots/Availability Endpoints** (Member 4)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| GET | `/slots/{doctor_id}` | Get available slots for doctor | No |
| POST | `/slots` | Create slot availability | Yes (Doctor) |

**Response Example:**

```javascript
GET /slots/5

[
  {
    "id": 201,
    "doctor_id": 5,
    "date": "2024-12-25",
    "time": "09:00",
    "is_available": true
  },
  {
    "id": 202,
    "doctor_id": 5,
    "date": "2024-12-25",
    "time": "09:30",
    "is_available": true
  }
]
```

### Database Models Expected

#### **User Model**
```python
class User(Base):
    __tablename__ = "users"
    
    id: int (Primary Key)
    full_name: str
    email: str (Unique)
    password_hash: str
    phone: str (Optional)
    role: str (patient, doctor, admin)
    created_at: datetime
    updated_at: datetime
```

#### **Doctor Model**
```python
class Doctor(Base):
    __tablename__ = "doctors"
    
    id: int (Primary Key)
    user_id: int (Foreign Key → User)
    speciality: str
    experience_years: int
    consultation_fee: float
    bio: str
    city: str
    rating: float (Default: 4.5)
    reviews: int (Default: 0)
```

#### **Appointment Model**
```python
class Appointment(Base):
    __tablename__ = "appointments"
    
    id: int (Primary Key)
    patient_id: int (Foreign Key → User)
    doctor_id: int (Foreign Key → Doctor)
    appointment_date: date
    appointment_time: time
    status: str (BOOKED, COMPLETED, CANCELLED)
    notes: str (Optional)
    created_at: datetime
```

#### **Slot Model**
```python
class Slot(Base):
    __tablename__ = "slots"
    
    id: int (Primary Key)
    doctor_id: int (Foreign Key → Doctor)
    date: date
    time: time
    is_available: bool
```

### Authentication Requirements

#### **JWT Token Details**
```python
# Token payload should include:
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "patient",
  "exp": <expiration_timestamp>
}

# Algorithm: HS256
# Secret Key: From .env file
# Expiration: Configure in .env (e.g., 60 minutes)
```

#### **Password Security**
- Minimum length: 8 characters
- Hash before storage (bcrypt recommended)
- Validate email format

### Additional Requirements

#### **Email Validation**
- Use Pydantic's `EmailStr` for validation
- Unique email constraint on database

#### **Field Validations**
```python
full_name: min_length=3, max_length=100
password: min_length=8, max_length=50
consultation_fee: Should be positive float
experience_years: Should be non-negative integer
```

#### **Error Handling**
- 400 Bad Request - Invalid input
- 401 Unauthorized - Invalid credentials
- 403 Forbidden - No permission
- 404 Not Found - Resource not found
- 500 Internal Server Error

#### **CORS Configuration**
Frontend runs on `http://localhost:5173`, so backend must allow this in development.

---

## 4. SUMMARY FOR MENTOR PRESENTATION

### Quick Talking Points

#### **Frontend-Backend Communication**
1. ✅ **REST API** - HTTP requests via Axios
2. ✅ **JWT Tokens** - Stored in localStorage, sent in Authorization header
3. ✅ **JSON Format** - All data in JSON format
4. ✅ **Error Handling** - Try/catch with graceful fallbacks
5. ✅ **Data Adapters** - Transform data between frontend and backend formats

#### **Frontend Technology Choices**
1. ✅ **React 18** - Modern, component-based, easy to scale
2. ✅ **Vite** - Fast dev server with HMR
3. ✅ **React Router** - Client-side navigation
4. ✅ **Axios** - Simple HTTP client with interceptors
5. ✅ **TailwindCSS** - Rapid UI development
6. ✅ **Context API** - Simple state management for auth

#### **Why These Choices?**
- **React:** Industry standard, large community, reusable components
- **Vite:** 10x faster than Webpack, faster builds
- **Axios:** Interceptors for automatic JWT attachment
- **TailwindCSS:** Responsive, utility-first, faster development
- **Context API:** No extra dependencies, perfect for auth state

#### **Backend Requirements Communicated**
1. ✅ **5 API Endpoints Groups** - Auth, Doctors, Appointments, Slots, Users
2. ✅ **Database Schema** - Users, Doctors, Appointments, Slots
3. ✅ **JWT Authentication** - Secure endpoints
4. ✅ **Data Format** - Specific field names and validation rules
5. ✅ **Error Responses** - Standard HTTP status codes

---

## 5. VISUAL ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
├──────────────────────┬──────────────────────────────────────┤
│  Components          │  Services Layer                       │
│  ├─ LoginPage        │  ├─ authService.js                   │
│  ├─ BookingWidget    │  ├─ appointmentService.js            │
│  ├─ DoctorCard       │  ├─ doctorService.js                 │
│  └─ Dashboards       │  ├─ adapters.js (Transform Data)     │
│                      │  └─ api.js (Axios + JWT)             │
├──────────────────────┼──────────────────────────────────────┤
│ State: AuthContext   │ Storage: localStorage                 │
│ (JWT Token)          │ (token, user data)                   │
└──────────────────────┴──────────────────────────────────────┘
                           │
                    HTTP + JSON + JWT
                           │
┌──────────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                          │
├──────────────────────┬──────────────────────────────────────┤
│  Routers             │  Services                             │
│  ├─ /auth           │  ├─ auth_service.py                  │
│  ├─ /doctors        │  ├─ doctor_service.py                │
│  ├─ /appointments   │  ├─ appointment_service.py           │
│  └─ /slots          │  └─ jwt_handler.py                   │
├──────────────────────┼──────────────────────────────────────┤
│ Models               │ Schemas (Validation)                  │
│ ├─ User             │  ├─ auth_schema.py                    │
│ ├─ Doctor           │  ├─ doctor_schema.py                 │
│ ├─ Appointment      │  ├─ appointment_schema.py            │
│ └─ Slot             │  └─ slot_schema.py                    │
└──────────────────────┴──────────────────────────────────────┘
                           │
                    SQL + ORM
                           │
         ┌─────────────────────────────┐
         │   PostgreSQL Database       │
         │  ├─ users table             │
         │  ├─ doctors table           │
         │  ├─ appointments table      │
         │  └─ slots table             │
         └─────────────────────────────┘
```

---

## 6. KEY ACHIEVEMENTS & TALKING POINTS

### What We Built Successfully

✅ **Scalable Architecture** - Separated concerns (services, components, adapters)
✅ **API-First Design** - Frontend ready for any backend API
✅ **Graceful Degradation** - Mock data fallback while backend is in development
✅ **Security** - JWT authentication, secure token storage
✅ **User Experience** - Role-based dashboards, responsive design
✅ **Code Reusability** - Components, services, adapters all modular

### Challenges Overcome

- **Data Format Mismatch** → Solved with adapter layer
- **Backend Not Ready** → Implemented mock fallbacks
- **Cross-Origin Requests** → Backend CORS configuration
- **State Management** → Used Context API instead of heavy Redux

---

## 7. QUESTIONS TO EXPECT & ANSWERS

**Q: Why Axios instead of Fetch API?**
A: Axios has built-in request/response interceptors which makes it easy to automatically attach JWT tokens to every request. Also better error handling.

**Q: Why adapters?**
A: Backend field names might differ from frontend needs. Adapters create a single source of truth for data transformation, making the app resilient to backend changes.

**Q: Why React Context instead of Redux?**
A: For this project, authentication state is simple enough for Context API. Redux would be overkill and add unnecessary complexity.

**Q: How do you ensure security?**
A: JWT tokens in localStorage, Authorization headers on every request, backend validates tokens, password hashed on backend.

**Q: What if backend is down?**
A: Graceful fallback with mock data so UI still works and looks correct during development.

