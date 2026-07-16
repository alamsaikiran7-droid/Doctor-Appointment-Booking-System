import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiHome, FiCalendar, FiClock, FiUser, FiUsers, FiFileText,
  FiPieChart, FiLogOut, FiHeart,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

const menus = {
  patient: [
    { label: "Dashboard", to: "/patient/dashboard", icon: FiHome },
    { label: "Book Appointment", to: "/doctors", icon: FiCalendar },
    { label: "My Appointments", to: "/my-appointments", icon: FiClock },
    { label: "Profile", to: "/patient/profile", icon: FiUser },
  ],
  doctor: [
    { label: "Dashboard", to: "/doctor/dashboard", icon: FiHome },
    { label: "Appointments", to: "/doctor/appointments", icon: FiClock },
    { label: "Availability", to: "/doctor/availability", icon: FiCalendar },
    { label: "Profile", to: "/doctor/profile", icon: FiUser },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard", icon: FiHome },
    { label: "Doctors", to: "/admin/doctors", icon: FiUsers },
    { label: "Patients", to: "/admin/patients", icon: FiUser },
    { label: "Appointments", to: "/admin/appointments", icon: FiFileText },
    { label: "Reports", to: "/admin/reports", icon: FiPieChart },
  ],
};

function Sidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const items = menus[role] || [];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-ink text-white/80 min-h-screen sticky top-0">
      <Link to="/" className="flex items-center gap-2.5 px-6 h-[76px] border-b border-white/10">
        <span className="w-9 h-9 rounded-lg bg-primary grid place-items-center">
          <FiHeart className="text-white" size={16} />
        </span>
        <span className="font-display text-lg text-white leading-none">
          NovaCare
        </span>
      </Link>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <p className="eyebrow !text-white/35 px-3 mb-3">
          {role} panel
        </p>
        {items.map(({ label, to, icon: Icon }, idx) => (
          <NavLink
            key={label + idx}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:bg-white/5 hover:text-accent transition w-full"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
