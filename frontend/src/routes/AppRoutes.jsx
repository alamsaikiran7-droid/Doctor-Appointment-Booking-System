import { BrowserRouter, Route, Routes } from "react-router-dom";

import About from "../pages/About";
import AddDoctor from "../pages/AddDoctor";
import AdminAppointments from "../pages/AdminAppointments";
import AdminDashboard from "../pages/AdminDashboard";
import AdminDoctorDetails from "../pages/AdminDoctorDetails";
import AdminDoctors from "../pages/AdminDoctors";
import AdminPatients from "../pages/AdminPatients";
import AdminReports from "../pages/AdminReports";
import Booking from "../pages/Booking";
import ChangeDoctorPassword from "../pages/ChangeDoctorPassword";
import Contact from "../pages/Contact";
import DoctorAccount from "../pages/DoctorAccount";
import DoctorAppointments from "../pages/DoctorAppointments";
import DoctorAvailability from "../pages/DoctorAvailability";
import DoctorDashboard from "../pages/DoctorDashboard";
import DoctorProfile from "../pages/DoctorProfile";
import Doctors from "../pages/Doctors";
import EditDoctorProfile from "../pages/EditDoctorProfile";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyAppointments from "../pages/MyAppointments";
import NotFound from "../pages/NotFound";
import PatientDashboard from "../pages/PatientDashboard";
import PatientProfile from "../pages/PatientProfile";
import Payment from "../pages/Payment";
import Register from "../pages/Register";
import AdminEditDoctor from "../pages/AdminEditDoctor";

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
        <Route path="/payment/:appointmentId" element={<Payment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />

        {/* Dynamic Auth */}
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />

        {/* Dashboards */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/availability" element={<DoctorAvailability />} />
        <Route path="/doctor/profile" element={<DoctorAccount />} />
        <Route path="/doctor/profile/edit" element={<EditDoctorProfile />} />
        <Route
          path="/doctor/change-password"
          element={<ChangeDoctorPassword />}
        />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors/add" element={<AddDoctor />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/doctors/:id" element={<AdminDoctorDetails />} />
        <Route path="/admin/doctors/:id/edit" element={<AdminEditDoctor />} />
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
