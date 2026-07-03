import { NavLink } from "react-router-dom";

function Sidebar({ role }) {

  const patientMenu = [
    { title: "Dashboard", path: "/patient/dashboard", icon: "🏠" },
    { title: "Book Appointment", path: "/doctors", icon: "📅" },
    { title: "My Appointments", path: "/my-appointments", icon: "📖" },
    { title: "Profile", path: "/patient/profile", icon: "👤" },
  ];

  const doctorMenu = [
    { title: "Dashboard", path: "/doctor/dashboard", icon: "🏠" },
    { title: "Appointments", path: "/doctor/appointments", icon: "📅" },
    { title: "Availability", path: "/doctor/availability", icon: "🕒" },
    { title: "Profile", path: "/doctor/profile", icon: "👨‍⚕️" },
  ];

  const adminMenu = [
    { title: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
    { title: "Doctors", path: "/admin/doctors", icon: "👨‍⚕️" },
    { title: "Patients", path: "/admin/patients", icon: "🧑" },
    { title: "Appointments", path: "/admin/appointments", icon: "📅" },
    { title: "Reports", path: "/admin/reports", icon: "📊" },
  ];

  let menu = [];

  if (role === "patient") menu = patientMenu;
  if (role === "doctor") menu = doctorMenu;
  if (role === "admin") menu = adminMenu;

  return (
    <div
      className="bg-primary text-white p-3 d-flex flex-column"
      style={{
        width: "260px",
        minHeight: "100vh",
      }}
    >
      <h3 className="text-center mb-4">
        🏥 MedCare
      </h3>

      {menu.map((item) => (
        <NavLink
          key={item.title}
          to={item.path}
          className="text-white text-decoration-none mb-3 p-2 rounded"
        >
          {item.icon} {item.title}
        </NavLink>
      ))}

      <div className="mt-auto">

        <hr />

        <NavLink
          to="/"
          className="text-white text-decoration-none"
        >
          🚪 Logout
        </NavLink>

      </div>

    </div>
  );
}

export default Sidebar;