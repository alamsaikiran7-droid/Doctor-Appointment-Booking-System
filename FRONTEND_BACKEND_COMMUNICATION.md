# Frontend & Backend Communication - Complete Architecture Guide

**Who This Is For:** Frontend developers learning how web apps work
**Project Used:** NovaCare Hospital Appointment System
**Level:** Beginner to Intermediate

---

## TABLE OF CONTENTS
1. [Communication Overview](#communication-overview)
2. [The Complete Request-Response Cycle](#complete-cycle)
3. [Authentication Flow](#authentication-flow)
4. [Data Flow Examples](#data-flow-examples)
5. [Error Handling](#error-handling)
6. [Real Code Examples](#real-code-examples)
7. [Common Patterns](#common-patterns)

---

## 🌐 COMMUNICATION OVERVIEW

### What is Frontend-Backend Communication?

```
Simple Explanation:
Frontend (React in browser) talks to Backend (FastAPI server)
by sending messages (HTTP requests) and receiving replies (HTTP responses)

Real World Analogy:
Client: "Give me a list of doctors in Cardiology specialty"
Server: "Here are 5 cardiologists"

Client: "I want to book appointment with Dr. Smith on 2024-12-25"
Server: "Appointment booked! Here's confirmation"

Client: "Cancel my appointment 101"
Server: "Appointment cancelled successfully"
```

### Two Separate Programs Communicating

```
┌────────────────────────────────────────────────────────────┐
│                    BROWSER (FRONTEND)                      │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  React App running in browser                        │ │
│  │  - User interface                                    │ │
│  │  - Components                                        │ │
│  │  - State management                                  │ │
│  │  - localStorage (stores token, user data)           │ │
│  └─────────────────┬──────────────────────────────────┘ │
│                    │                                      │
│                    │ INTERNET (HTTP/HTTPS)               │
│                    │ JSON data packets                    │
│                    ↓                                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Axios HTTP Client                                   │ │
│  │  - Sends requests                                    │ │
│  │  - Receives responses                                │ │
│  │  - Adds JWT token automatically                      │ │
│  │  - Handles errors                                    │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
                         ⬇️ ⬆️
              HTTP Requests & Responses
              (on port 8000)
                         ⬇️ ⬆️
┌────────────────────────────────────────────────────────────┐
│                 SERVER (BACKEND)                           │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  FastAPI Application running on server              │ │
│  │  - Receives HTTP requests                           │ │
│  │  - Validates JWT tokens                             │ │
│  │  - Executes business logic                          │ │
│  │  - Queries database                                 │ │
│  │  - Sends JSON responses                             │ │
│  └─────────────────┬──────────────────────────────────┘ │
│                    │                                      │
│                    ↓                                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Database                                │ │
│  │  - Stores all data                                  │ │
│  │  - Tables: users, doctors, appointments, slots     │ │
│  │  - Relationships between data                       │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 COMPLETE REQUEST-RESPONSE CYCLE

### The Full Journey of Data

```
STEP 1: USER INTERACTION
┌─────────────────────────────────┐
│ User clicks "Book Appointment"  │
│ Form fills in:                  │
│ - Doctor: Dr. Ahmed (ID: 5)    │
│ - Date: 2024-12-25             │
│ - Time: 14:30                   │
└────────────┬────────────────────┘
             ↓

STEP 2: COMPONENT STATE UPDATES (React)
┌─────────────────────────────────┐
│ Component state updates:        │
│ {                              │
│   doctorId: 5,                 │
│   date: "2024-12-25",          │
│   time: "14:30"                │
│ }                              │
└────────────┬────────────────────┘
             ↓

STEP 3: SERVICE CALLS BACKEND
┌─────────────────────────────────┐
│ appointmentService.js           │
│ calls:                          │
│ api.post('/appointments', {...})│
└────────────┬────────────────────┘
             ↓

STEP 4: DATA TRANSFORMATION
┌─────────────────────────────────┐
│ adapters.js transforms:         │
│ Frontend format →               │
│ Backend format                  │
│                                 │
│ doctorId → doctor_id            │
│ patientId → patient_id          │
│ date → appointment_date         │
│ time → appointment_time         │
└────────────┬────────────────────┘
             ↓

STEP 5: AXIOS ADDS JWT TOKEN
┌─────────────────────────────────┐
│ Interceptor adds to headers:    │
│                                 │
│ Authorization:                  │
│ Bearer eyJhbGc...              │
│ (JWT token from localStorage)   │
└────────────┬────────────────────┘
             ↓

STEP 6: HTTP REQUEST SENT
┌─────────────────────────────────┐
│ POST /appointments              │
│ Headers: {                      │
│   Authorization: Bearer xyz...  │
│   Content-Type: application/json│
│ }                              │
│ Body: {                        │
│   patient_id: 1,              │
│   doctor_id: 5,               │
│   appointment_date: 2024-12-25│
│   appointment_time: 14:30     │
│   notes: ""                   │
│ }                             │
└────────────┬────────────────────┘
             ↓
        🌐 INTERNET 🌐
             ↓

STEP 7: BACKEND RECEIVES REQUEST
┌─────────────────────────────────┐
│ FastAPI receives:               │
│ POST /appointments              │
│ Extracts JWT token from header  │
└────────────┬────────────────────┘
             ↓

STEP 8: BACKEND VALIDATES TOKEN
┌─────────────────────────────────┐
│ JWT validation:                 │
│ ✓ Token exists?                │
│ ✓ Token not expired?           │
│ ✓ Token valid signature?       │
│ ✓ Extract user_id from token   │
│                                │
│ If fails → Return 401 Error    │
└────────────┬────────────────────┘
             ↓

STEP 9: VALIDATE REQUEST DATA
┌─────────────────────────────────┐
│ Backend checks:                 │
│ ✓ patient_id is number?        │
│ ✓ doctor_id exists?            │
│ ✓ appointment_date in future?  │
│ ✓ slot is available?           │
│                                │
│ If invalid → Return 400 Error  │
└────────────┬────────────────────┘
             ↓

STEP 10: DATABASE QUERY
┌─────────────────────────────────┐
│ Backend queries PostgreSQL:      │
│                                 │
│ 1. SELECT doctor                │
│    WHERE id = 5                 │
│                                 │
│ 2. SELECT patient               │
│    WHERE id = 1                 │
│                                 │
│ 3. SELECT slot                  │
│    WHERE doctor_id = 5          │
│    AND date = 2024-12-25        │
│    AND time = 14:30             │
│    AND is_available = true      │
│                                 │
│ 4. INSERT appointment           │
│    (All data validated above)   │
└────────────┬────────────────────┘
             ↓

STEP 11: DATABASE OPERATIONS
┌─────────────────────────────────┐
│ PostgreSQL:                     │
│                                 │
│ CREATE new appointment          │
│ UPDATE slot (set unavailable)   │
│ RETURN created appointment ID   │
│                                 │
│ If error → Return 500 Error    │
└────────────┬────────────────────┘
             ↓

STEP 12: BACKEND PREPARES RESPONSE
┌─────────────────────────────────┐
│ Backend creates response:       │
│                                 │
│ {                               │
│   "id": 101,                   │
│   "patient_id": 1,             │
│   "doctor_id": 5,              │
│   "appointment_date": "2024-12-25",│
│   "appointment_time": "14:30", │
│   "status": "BOOKED",          │
│   "created_at": "2024-12-20T.."│
│ }                              │
│                                 │
│ HTTP Status: 201 (Created)     │
└────────────┬────────────────────┘
             ↓

STEP 13: HTTP RESPONSE SENT
┌─────────────────────────────────┐
│ Response travels through        │
│ internet back to frontend       │
└────────────┬────────────────────┘
             ↓
        🌐 INTERNET 🌐
             ↓

STEP 14: FRONTEND RECEIVES RESPONSE
┌─────────────────────────────────┐
│ Axios receives:                 │
│ Status: 201                     │
│ Data: { id: 101, ... }         │
└────────────┬────────────────────┘
             ↓

STEP 15: FRONTEND TRANSFORMS RESPONSE
┌─────────────────────────────────┐
│ adapters.js transforms:         │
│ Backend format →                │
│ Frontend format                 │
│                                 │
│ appointment_date → date         │
│ appointment_time → time         │
│ doctor_id → doctorId            │
└────────────┬────────────────────┘
             ↓

STEP 16: UPDATE REACT STATE
┌─────────────────────────────────┐
│ Component state updates:        │
│ setAppointments([...prev,       │
│   transformedData])             │
│                                 │
│ This triggers React re-render   │
└────────────┬────────────────────┘
             ↓

STEP 17: UI UPDATES
┌─────────────────────────────────┐
│ Component re-renders with new   │
│ data                            │
│                                 │
│ User sees success message:      │
│ "Appointment booked! ID: 101"  │
│                                 │
│ Appointment appears in list     │
└─────────────────────────────────┘

RESULT: ✅ Complete cycle finished!
Time taken: ~200-500ms
```

---

## 🔐 AUTHENTICATION FLOW - JWT TOKENS

### How Users Stay Logged In

```
┌─── SCENARIO: User wants to stay logged in ───┐

PROBLEM:
HTTP is STATELESS
- Every request is independent
- Server doesn't remember previous requests
- How does server know who's making request?

SOLUTION: JWT Token
- Like a passport/ID card
- Sent with every request
- Server verifies it's real
- Contains user information

╔═══════════════════════════════════════════════╗
║           JWT TOKEN ANATOMY                  ║
╚═══════════════════════════════════════════════╝

JWT = 3 parts separated by dots (.)

eyJhbGc...      .      eyJz...     .    SflKx...
 (part 1)              (part 2)          (part 3)
  HEADER               PAYLOAD           SIGNATURE

PART 1: HEADER (Algorithm)
{
  "alg": "HS256",
  "typ": "JWT"
}

PART 2: PAYLOAD (Data)
{
  "sub": "1",           ← User ID
  "email": "john@example.com",
  "role": "patient",
  "exp": 1703084400     ← Expiration timestamp
}

PART 3: SIGNATURE (Verification)
HMACSHA256(
  base64UrlEncode(header) + "." + 
  base64UrlEncode(payload),
  "secret-key"
)
- Backend signs token with secret key
- Backend can verify it wasn't tampered with
```

### Complete Authentication Flow

```
STEP 1: USER LOGS IN
┌──────────────────────────────────┐
│ User enters:                     │
│ Email: john@example.com         │
│ Password: mypassword123         │
│                                 │
│ Clicks: [Login Button]          │
└────────────┬─────────────────────┘
             ↓

STEP 2: FRONTEND SENDS CREDENTIALS
┌──────────────────────────────────┐
│ POST /auth/login                 │
│ {                                │
│   "email": "john@example.com",  │
│   "password": "mypassword123"   │
│ }                                │
│                                 │
│ ⚠️ NO token yet (first request) │
└────────────┬─────────────────────┘
             ↓

STEP 3: BACKEND VALIDATES PASSWORD
┌──────────────────────────────────┐
│ Backend:                         │
│ 1. Find user by email           │
│ 2. Hash submitted password      │
│ 3. Compare with stored hash     │
│    (passwords never match)      │
│    (compare hashes only)        │
│                                 │
│ If match → proceed              │
│ If no match → return 401 Error  │
└────────────┬─────────────────────┘
             ↓

STEP 4: BACKEND CREATES JWT TOKEN
┌──────────────────────────────────┐
│ Backend creates token:          │
│                                 │
│ token = create_token({          │
│   "sub": "1",                  │
│   "email": "john@example.com", │
│   "role": "patient",           │
│   "exp": datetime.now() + 60min│
│ })                             │
│                                 │
│ HS256 signature with secret_key│
└────────────┬─────────────────────┘
             ↓

STEP 5: BACKEND SENDS TOKEN
┌──────────────────────────────────┐
│ HTTP Response:                  │
│ Status: 200 OK                  │
│ {                                │
│   "access_token": "eyJhbGc...", │
│   "token_type": "bearer",       │
│   "user": {                     │
│     "id": 1,                   │
│     "email": "john@...",       │
│     "role": "patient"          │
│   }                             │
│ }                                │
└────────────┬─────────────────────┘
             ↓

STEP 6: FRONTEND STORES TOKEN
┌──────────────────────────────────┐
│ JavaScript stores token:        │
│                                 │
│ localStorage.setItem(           │
│   "novacare_token",            │
│   "eyJhbGc..."                 │
│ )                               │
│                                 │
│ Token persists even if browser  │
│ closed and reopened             │
└────────────┬─────────────────────┘
             ↓

STEP 7: FRONTEND UPDATES CONTEXT
┌──────────────────────────────────┐
│ React Context updates:          │
│ {                                │
│   user: {                       │
│     id: 1,                     │
│     email: "john@...",         │
│     role: "patient"            │
│   },                            │
│   isLoggedIn: true              │
│ }                                │
│                                 │
│ Triggers React re-render        │
└────────────┬─────────────────────┘
             ↓

STEP 8: REDIRECT TO DASHBOARD
┌──────────────────────────────────┐
│ navigate('/patient/dashboard')  │
│                                 │
│ User sees dashboard             │
└─────────────────────────────────┘


╔═══════════════════════════════════════════════╗
║  NEXT TIME USER MAKES A REQUEST:              ║
╚═══════════════════════════════════════════════╝

STEP 1: AXIOS INTERCEPTOR
┌──────────────────────────────────┐
│ Axios interceptor triggers:     │
│                                 │
│ axios.interceptors.request.use( │
│   (config) => {                │
│     const token = localStorage  │
│       .getItem('novacare_token')│
│     config.headers.Authorization│
│       = `Bearer ${token}`      │
│     return config              │
│   }                             │
│ )                               │
└────────────┬─────────────────────┘
             ↓

STEP 2: REQUEST WITH TOKEN
┌──────────────────────────────────┐
│ GET /appointments               │
│ Headers: {                       │
│   "Authorization": "Bearer      │
│                   eyJhbGc..."  │
│ }                                │
│                                 │
│ ✅ Token auto-added to request  │
└────────────┬─────────────────────┘
             ↓

STEP 3: BACKEND VERIFIES TOKEN
┌──────────────────────────────────┐
│ Backend:                         │
│ 1. Extract token from header    │
│ 2. Decode token                 │
│ 3. Verify signature with secret_key│
│ 4. Check if expired             │
│ 5. Extract user_id              │
│                                 │
│ If valid → Process request      │
│ If invalid → Return 401 Error  │
└────────────┬─────────────────────┘
             ↓

STEP 4: BACKEND PROCESSES REQUEST
┌──────────────────────────────────┐
│ Backend:                         │
│ 1. User ID from token: 1        │
│ 2. Query appointments WHERE     │
│    patient_id = 1              │
│ 3. Return data                  │
│                                 │
│ User only sees THEIR data       │
│ (Security: can't see others)   │
└─────────────────────────────────┘


╔═══════════════════════════════════════════════╗
║  WHEN TOKEN EXPIRES (60 minutes):             ║
╚═══════════════════════════════════════════════╝

User makes request with old token
         ↓
Backend checks token
         ↓
Token expired! Return 401 Unauthorized
         ↓
Frontend catches 401 error
         ↓
Clear localStorage token
         ↓
Redirect to /login page
         ↓
User sees: "Your session expired. Please login again"
```

---

## 📊 DATA FLOW EXAMPLES

### Example 1: Getting Doctor List

```
SCENARIO: User browses doctors

Frontend Component (Doctors.jsx):
┌─────────────────────────────────┐
│ useEffect(() => {               │
│   getDoctors()                  │
│     .then(setDoctors)           │
│ }, [])                          │
└────────────┬────────────────────┘
             ↓

Service (doctorService.js):
┌─────────────────────────────────┐
│ export async function getDoctors│
│ api.get('/doctors')             │
└────────────┬────────────────────┘
             ↓

Adapter (adapters.js):
┌─────────────────────────────────┐
│ Backend returns:                │
│ {                               │
│   "id": 1,                     │
│   "name": "Dr. Smith",         │
│   "speciality": "Cardiology",  │
│   "city": "New York",          │
│   "experience_years": 10,      │
│   "consultation_fee": 150,     │
│   "rating": 4.8,               │
│   "reviews": 45                │
│ }                               │
│                                 │
│ Frontend needs:                 │
│ {                               │
│   "id": 1,                     │
│   "name": "Dr. Smith",         │
│   "specialization": "Cardiology",│
│   "city": "New York",          │
│   "experience": 10,            │
│   "fee": 150,                  │
│   "rating": 4.8,               │
│   "reviews": 45                │
│ }                               │
│                                 │
│ adaptDoctor() transforms:      │
│ speciality → specialization    │
│ experience_years → experience  │
│ consultation_fee → fee         │
└────────────┬────────────────────┘
             ↓

Component Renders:
┌─────────────────────────────────┐
│ {doctors.map(doctor => (       │
│   <DoctorCard doctor={doctor}  │
│     key={doctor.id}            │
│   />                            │
│ ))}                             │
│                                 │
│ UI shows: List of doctors       │
└─────────────────────────────────┘
```

### Example 2: Booking Appointment

```
SCENARIO: Patient books appointment with Dr. Smith

User Action:
┌─────────────────────────────────┐
│ Doctor: Dr. Smith (ID: 5)      │
│ Date: 2024-12-25               │
│ Time: 14:30                     │
│ Notes: "Routine checkup"       │
│ [Book Button]                  │
└────────────┬────────────────────┘
             ↓

Form Submission:
┌─────────────────────────────────┐
│ handleSubmit(e) {              │
│   e.preventDefault()           │
│   bookAppointment({            │
│     doctorId: 5,              │
│     date: "2024-12-25",       │
│     time: "14:30",            │
│     notes: "Routine checkup"  │
│   })                           │
│ }                              │
└────────────┬────────────────────┘
             ↓

Service Call:
┌─────────────────────────────────┐
│ export async function          │
│ bookAppointment(payload)       │
│ {                              │
│   const backend = adapters     │
│     .adaptAppointmentForBackend│
│     (payload)                  │
│   const { data } = api.post(   │
│     '/appointments',           │
│     backend                    │
│   )                            │
│   return adapters              │
│     .adaptAppointment(data)    │
│ }                              │
└────────────┬────────────────────┘
             ↓

Adapter Transforms:
┌─────────────────────────────────┐
│ Frontend format:                │
│ {                               │
│   doctorId: 5,    ← camelCase  │
│   patientId: 1,                │
│   date: "2024-12-25",          │
│   time: "14:30"                │
│ }                               │
│                                 │
│ Backend format:                 │
│ {                               │
│   doctor_id: 5,   ← snake_case │
│   patient_id: 1,               │
│   appointment_date: "2024-12-25",│
│   appointment_time: "14:30"    │
│ }                               │
└────────────┬────────────────────┘
             ↓

HTTP Request:
┌─────────────────────────────────┐
│ POST /appointments              │
│ Authorization: Bearer token     │
│ Content-Type: application/json  │
│                                 │
│ {                               │
│   "doctor_id": 5,              │
│   "patient_id": 1,             │
│   "appointment_date": "2024-12-25",│
│   "appointment_time": "14:30"  │
│ }                               │
└────────────┬────────────────────┘
             ↓

Backend Processing:
┌─────────────────────────────────┐
│ @app.post('/appointments')      │
│ async def create_appointment(   │
│   appointment: AppointmentIn   │
│ ):                              │
│   # Validate token             │
│   # Validate data              │
│   # Check slot available       │
│   # Create in database         │
│   # Return created appointment │
└────────────┬────────────────────┘
             ↓

Backend Response:
┌─────────────────────────────────┐
│ {                               │
│   "id": 101,                   │
│   "patient_id": 1,             │
│   "doctor_id": 5,              │
│   "appointment_date": "2024-12-25",│
│   "appointment_time": "14:30", │
│   "status": "BOOKED",          │
│   "created_at": "2024-12-20T..." │
│ }                               │
└────────────┬────────────────────┘
             ↓

Frontend Adapts Response:
┌─────────────────────────────────┐
│ Backend:                         │
│ {                               │
│   appointment_date: "2024-12-25",│
│   appointment_time: "14:30"    │
│ }                               │
│                                 │
│ Frontend:                        │
│ {                               │
│   date: "2024-12-25",          │
│   time: "14:30"                │
│ }                               │
└────────────┬────────────────────┘
             ↓

Update State:
┌─────────────────────────────────┐
│ setAppointments([...prev,      │
│   adaptedAppointment           │
│ ])                              │
└────────────┬────────────────────┘
             ↓

Show Success:
┌─────────────────────────────────┐
│ ✅ Appointment booked!          │
│ Appointment ID: 101            │
│ Doctor: Dr. Smith              │
│ Date: 2024-12-25               │
│ Time: 14:30                    │
└─────────────────────────────────┘
```

---

## ⚠️ ERROR HANDLING

### What Happens When Things Go Wrong

```
┌──────────────────────────────────────┐
│  HTTP STATUS CODES                   │
└──────────────────────────────────────┘

2xx - SUCCESS
├─ 200 OK: Request succeeded
├─ 201 Created: Resource created
└─ 204 No Content: Success, no data

4xx - CLIENT ERROR
├─ 400 Bad Request
│  Example: Missing required field
│  Response: {
│    "error": "Date is required"
│  }
│
├─ 401 Unauthorized
│  Example: Invalid/expired token
│  Response: {
│    "error": "Token expired. Please login."
│  }
│  Frontend action: Clear token, redirect to login
│
├─ 403 Forbidden
│  Example: Patient trying to see all users
│  Response: {
│    "error": "You don't have permission"
│  }
│
└─ 404 Not Found
   Example: Requesting doctor ID 999
   Response: {
     "error": "Doctor not found"
   }

5xx - SERVER ERROR
├─ 500 Internal Server Error
│  Example: Backend crash
│  Response: {
│    "error": "Something went wrong"
│  }
│  Frontend action: Show error, let user retry
│
└─ 503 Service Unavailable
   Example: Database down
   Response: {
     "error": "Service temporarily unavailable"
   }
```

### Error Handling in Code

```javascript
// services/appointmentService.js

export async function bookAppointment(payload) {
  try {
    // Transform data
    const backendPayload = 
      adaptAppointmentForBackend(payload);
    
    // Make request
    const { data } = await api.post(
      '/appointments',
      backendPayload
    );
    
    // Success - transform response
    return adaptAppointment(data);
    
  } catch (err) {
    // HANDLE ERRORS
    
    if (err.response?.status === 400) {
      // Validation error - user's fault
      console.error("Invalid input:", err.response.data);
      throw new Error(err.response.data.error);
    }
    
    if (err.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('novacare_token');
      window.location.href = '/login/patient';
      throw new Error("Please login again");
    }
    
    if (err.response?.status === 500) {
      // Server error - not user's fault
      console.error("Server error:", err.response.data);
      throw new Error("Server error. Please try again.");
    }
    
    if (!err.response) {
      // Network error - no internet
      console.error("Network error");
      throw new Error("Network error. Check your connection.");
    }
    
    // Unknown error
    throw new Error("Something went wrong");
  }
}

// In component:
function BookingForm() {
  const [error, setError] = useState('');
  
  const handleBook = async (data) => {
    try {
      await bookAppointment(data);
      // Show success
      setError('');
      navigate('/my-appointments');
    } catch (err) {
      // Show error to user
      setError(err.message);
    }
  };
  
  return (
    <form onSubmit={handleBook}>
      {error && (
        <div className="error-banner">
          ❌ {error}
        </div>
      )}
      {/* form fields */}
    </form>
  );
}
```

---

## 💻 REAL CODE EXAMPLES

### Example 1: Complete Login Flow

```javascript
// FRONTEND: Login Form Component

// pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../services/authService';
import useAuth from '../hooks/useAuth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();  // Update global auth state
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // ✅ Call service (handles all communication)
      const user = await loginRequest({
        role: 'patient',
        username,
        password
      });
      
      // ✅ Update global auth state
      login(user);
      
      // ✅ Redirect to dashboard
      navigate('/patient/dashboard');
      
    } catch (err) {
      // ❌ Show error to user
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        disabled={loading}
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={loading}
      />
      
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default Login;

// ────────────────────────────────────────

// FRONTEND: Service Layer

// services/authService.js
import api from './api';
import { setUser } from '../utils/storage';
import { adaptUser } from './adapters';

export async function login({ role, username, password }) {
  try {
    // 1️⃣ Make HTTP request
    const { data } = await api.post('/auth/login', {
      role,
      username,
      password
    });
    
    // 2️⃣ Store token
    localStorage.setItem('novacare_token', data.token);
    
    // 3️⃣ Transform user data
    const user = adaptUser(data.user || data);
    
    // 4️⃣ Store user
    setUser(user);
    
    // 5️⃣ Return user
    return user;
    
  } catch (err) {
    // Handle error
    console.error('Login failed:', err);
    throw new Error(
      err.response?.data?.error || 'Login failed'
    );
  }
}

// ────────────────────────────────────────

// FRONTEND: HTTP Client

// services/api.js
import axios from 'axios';

const baseURL = 
  import.meta.env.VITE_API_URL || 
  'http://localhost:8000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔑 CRUCIAL: JWT Interceptor
api.interceptors.request.use((config) => {
  // Get token from storage
  const token = localStorage.getItem('novacare_token');
  
  // Add to every request
  if (token) {
    config.headers.Authorization = 
      `Bearer ${token}`;
  }
  
  return config;
});

export default api;

// ────────────────────────────────────────

// BACKEND: Receives Request

// backend/app/routers/auth.py
from fastapi import APIRouter, HTTPException
from fastapi.security import HTTPBearer
from app.schemas.auth_schema import LoginRequest
from app.services.auth_service import verify_password
from app.utils.jwt_handler import create_token

router = APIRouter(prefix='/auth', tags=['auth'])

@router.post('/login')
async def login(request: LoginRequest):
  # 1️⃣ Validate request format
  if not request.email or not request.password:
    raise HTTPException(
      status_code=400,
      detail='Email and password required'
    )
  
  # 2️⃣ Find user in database
  db_user = db.query(User).filter(
    User.email == request.email
  ).first()
  
  if not db_user:
    raise HTTPException(
      status_code=401,
      detail='Invalid credentials'
    )
  
  # 3️⃣ Verify password
  if not verify_password(
    request.password,
    db_user.password_hash
  ):
    raise HTTPException(
      status_code=401,
      detail='Invalid credentials'
    )
  
  # 4️⃣ Create JWT token
  token = create_token({
    'sub': str(db_user.id),
    'email': db_user.email,
    'role': db_user.role
  })
  
  # 5️⃣ Return response
  return {
    'token': token,
    'token_type': 'bearer',
    'user': {
      'id': db_user.id,
      'full_name': db_user.full_name,
      'email': db_user.email,
      'role': db_user.role
    }
  }
```

### Example 2: Complete Appointment Booking

```javascript
// FRONTEND: Booking Component

// pages/Booking.jsx
import { useState } from 'react';
import { bookAppointment } from '../services/appointmentService';

function Booking({ doctorId }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // ✅ Call service
      await bookAppointment({
        doctorId,
        date,
        time,
        notes
      });
      
      // ✅ Show success
      setSuccess(true);
      setDate('');
      setTime('');
      setNotes('');
      
    } catch (err) {
      // ❌ Show error
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleBook}>
      {error && <div className="error">{error}</div>}
      {success && (
        <div className="success">
          ✅ Appointment booked successfully!
        </div>
      )}
      
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />
      
      <button disabled={loading}>
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
}

// ────────────────────────────────────────

// FRONTEND: Service

// services/appointmentService.js
import api from './api';
import { 
  adaptAppointmentForBackend,
  adaptAppointment 
} from './adapters';

export async function bookAppointment(payload) {
  // 1️⃣ Transform data
  const backendPayload = 
    adaptAppointmentForBackend(payload);
  
  // 2️⃣ Make request
  const { data } = await api.post(
    '/appointments',
    backendPayload
  );
  
  // 3️⃣ Transform response
  return adaptAppointment(data);
}

// ────────────────────────────────────────

// FRONTEND: Adapter

// services/adapters.js
export function adaptAppointmentForBackend(frontend) {
  return {
    doctor_id: frontend.doctorId,
    appointment_date: frontend.date,
    appointment_time: frontend.time,
    notes: frontend.notes
  };
}

export function adaptAppointment(backend) {
  return {
    id: backend.id,
    doctorId: backend.doctor_id,
    date: backend.appointment_date,
    time: backend.appointment_time,
    status: backend.status.toUpperCase(),
    notes: backend.notes
  };
}

// ────────────────────────────────────────

// BACKEND: Processing

// backend/app/routers/appointments.py
from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models import Appointment, Doctor, Slot
from app.schemas.appointment_schema import AppointmentCreate
from app.utils.jwt_handler import get_current_user

router = APIRouter(prefix='/appointments')

@router.post('/')
async def create_appointment(
  appointment: AppointmentCreate,
  current_user = Depends(get_current_user),
  db = Depends(SessionLocal)
):
  # 1️⃣ Validate doctor exists
  doctor = db.query(Doctor).filter(
    Doctor.id == appointment.doctor_id
  ).first()
  
  if not doctor:
    raise HTTPException(
      status_code=404,
      detail='Doctor not found'
    )
  
  # 2️⃣ Validate slot is available
  slot = db.query(Slot).filter(
    Slot.doctor_id == appointment.doctor_id,
    Slot.date == appointment.appointment_date,
    Slot.time == appointment.appointment_time,
    Slot.is_available == True
  ).first()
  
  if not slot:
    raise HTTPException(
      status_code=400,
      detail='Slot not available'
    )
  
  # 3️⃣ Create appointment
  new_appointment = Appointment(
    patient_id=current_user.id,
    doctor_id=appointment.doctor_id,
    appointment_date=appointment.appointment_date,
    appointment_time=appointment.appointment_time,
    notes=appointment.notes,
    status='BOOKED'
  )
  
  # 4️⃣ Mark slot as unavailable
  slot.is_available = False
  
  # 5️⃣ Save to database
  db.add(new_appointment)
  db.commit()
  db.refresh(new_appointment)
  
  # 6️⃣ Return response
  return {
    'id': new_appointment.id,
    'patient_id': new_appointment.patient_id,
    'doctor_id': new_appointment.doctor_id,
    'appointment_date': str(new_appointment.appointment_date),
    'appointment_time': str(new_appointment.appointment_time),
    'status': new_appointment.status,
    'notes': new_appointment.notes,
    'created_at': new_appointment.created_at
  }
```

---

## 🎯 COMMON PATTERNS

### Pattern 1: Fetch Data on Component Load

```javascript
// ✅ CORRECT PATTERN

import { useEffect, useState } from 'react';
import { getDoctors } from '../services/doctorService';

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // 1️⃣ Set loading
    setLoading(true);
    
    // 2️⃣ Fetch data
    getDoctors()
      .then(data => {
        setDoctors(data);
        setError('');
      })
      .catch(err => {
        setError(err.message);
        setDoctors([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);  // Empty dependency array = runs once on mount
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {doctors.map(doc => (
        <div key={doc.id}>{doc.name}</div>
      ))}
    </div>
  );
}
```

### Pattern 2: Submit Form Data

```javascript
// ✅ CORRECT PATTERN

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    setLoading(true);
    setError('');
    
    try {
      // Call service
      const result = await loginService({
        email,
        password
      });
      
      // Success
      navigate('/dashboard');
      
    } catch (err) {
      // Failure
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} />
      <button disabled={loading}>{loading ? 'Logging...' : 'Login'}</button>
    </form>
  );
}
```

### Pattern 3: Filter Data

```javascript
// ✅ CORRECT PATTERN

function DoctorFilter() {
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  
  useEffect(() => {
    // Fetch when filters change
    getDoctors({
      specialty,
      city
    }).then(setDoctors);
  }, [specialty, city]);  // Re-fetch when these change
  
  return (
    <div>
      <select 
        value={specialty}
        onChange={e => setSpecialty(e.target.value)}
      >
        <option>All</option>
        <option>Cardiology</option>
        <option>Dermatology</option>
      </select>
      
      <select
        value={city}
        onChange={e => setCity(e.target.value)}
      >
        <option>All</option>
        <option>New York</option>
        <option>Los Angeles</option>
      </select>
      
      {doctors.map(doc => <DoctorCard doc={doc} />)}
    </div>
  );
}
```

---

## 📌 SUMMARY

### Key Concepts

```
1. FRONTEND & BACKEND ARE SEPARATE
   - Frontend: React in browser (port 5173)
   - Backend: FastAPI server (port 8000)
   - They talk via HTTP requests

2. COMMUNICATION STEPS
   - User action triggers component
   - Component calls service
   - Service transforms data
   - Axios sends HTTP request
   - Backend receives & validates
   - Backend queries database
   - Backend sends response
   - Frontend transforms response
   - React re-renders

3. AUTHENTICATION (JWT)
   - User logs in → Backend creates token
   - Frontend stores in localStorage
   - Axios interceptor adds to every request
   - Backend verifies before processing
   - Token expires after time period

4. ADAPTERS TRANSFORM DATA
   - Backend field names (snake_case)
   - Frontend field names (camelCase)
   - Adapters convert both directions
   - Keeps frontend independent from backend

5. ERROR HANDLING
   - 400 Bad Request: User's fault
   - 401 Unauthorized: Token invalid/expired
   - 500 Server Error: Backend crash
   - Network Error: No internet
   - Always show error to user

6. BEST PRACTICES
   - Always handle errors
   - Show loading state
   - Validate on frontend AND backend
   - Transform data with adapters
   - Use JWT for authentication
   - Use axios interceptors for tokens
   - Keep services separate from components
```

### The Complete Flow (One More Time)

```
USER INTERACTION
        ↓
COMPONENT STATE
        ↓
SERVICE CALL
        ↓
DATA ADAPTER (Frontend → Backend format)
        ↓
AXIOS WITH JWT TOKEN
        ↓
━━━━━ HTTP REQUEST ━━━━━
        ↓
BACKEND RECEIVES
        ↓
TOKEN VALIDATION
        ↓
REQUEST VALIDATION
        ↓
DATABASE QUERY
        ↓
━━━━━ HTTP RESPONSE ━━━━━
        ↓
FRONTEND RECEIVES
        ↓
DATA ADAPTER (Backend → Frontend format)
        ↓
STATE UPDATE
        ↓
COMPONENT RE-RENDER
        ↓
USER SEES RESULT
```

