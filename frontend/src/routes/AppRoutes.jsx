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
import DoctorAppointments from "../pages/DoctorAppointments";
import DoctorAvailability from "../pages/DoctorAvailability";
import DoctorAccount from "../pages/DoctorAccount";
import AdminDashboard from "../pages/AdminDashboard";
import AdminDoctors from "../pages/AdminDoctors";
import AddDoctor from "../pages/AddDoctor";
import AdminPatients from "../pages/AdminPatients";
import AdminAppointments from "../pages/AdminAppointments";
import AdminReports from "../pages/AdminReports";
import ForgotPassword from "../pages/ForgotPassword";

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

        {/* Dynamic Auth */}
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />

        {/* Dashboards */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/availability" element={<DoctorAvailability />} />
        <Route path="/doctor/profile" element={<DoctorAccount />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors/add" element={<AddDoctor />}/>
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/patients" element={<AdminPatients />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
