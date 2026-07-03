import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Doctors from "../pages/Doctors";
import DoctorProfile from "../pages/DoctorProfile";
import Booking from "../pages/Booking";
import MyAppointments from "../pages/MyAppointments";

import Login from "../pages/Login";
import Register from "../pages/Register";

import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard";

import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Pages */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route path="/doctors/:id" element={<DoctorProfile />} />

        <Route path="/booking/:id" element={<Booking />} />

        <Route path="/my-appointments" element={<MyAppointments />} />

        {/* Dynamic Login */}

        <Route path="/login/:role" element={<Login />} />

        {/* Dynamic Register */}

        <Route path="/register/:role" element={<Register />} />

        {/* Dashboards */}

        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* 404 */}

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;