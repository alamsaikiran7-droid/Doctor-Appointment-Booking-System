import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiPlusCircle, FiLogOut, FiUser } from "react-icons/fi";

import LoginRoleModal from "./LoginRoleModal";
import useAuth from "../hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/doctors", label: "Doctors" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user ? `/${user.role}/dashboard` : "/";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 shadow-sm backdrop-blur-xl">
        <div className="container-nc flex h-[76px] items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary shadow-sm transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-lg">
              <span className="text-white font-display italic text-lg leading-none">
                N
              </span>
            </span>

            <span className="font-display text-xl leading-none text-ink transition-all duration-300 group-hover:text-primary">
              NovaCare <span className="italic text-primary">Hospitals</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary bg-primary-light"
                      : "text-ink-soft hover:-translate-y-0.5 hover:text-primary hover:bg-primary-light/60"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-3">
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-transparent px-5 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-light/50 hover:text-primary hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                >
                  <FiUser
                    size={15}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  Login
                </button>

                <button
                  onClick={() => navigate("/register/patient")}
                  className="btn-outline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(dashboardPath)}
                  className="flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary transition"
                >
                  <span className="w-8 h-8 rounded-full bg-primary-light grid place-items-center text-primary">
                    <FiUser size={15} />
                  </span>

                  {user.name || "My Account"}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to logout?")) {
                      logout();
                      navigate("/");
                    }
                  }}
                  className="btn-outline !px-4"
                  title="Logout"
                >
                  <FiLogOut size={15} />
                </button>
              </>
            )}

            <Link
              to="/doctors"
              className="group btn-accent inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
            >
              <FiPlusCircle
                size={16}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              Book Appointment
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-primary-light text-ink"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="animate-fade-up border-t border-line bg-white/95 px-5 pb-6 pt-3 shadow-lg backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-primary bg-primary-light"
                        : "text-ink-soft hover:-translate-y-0.5 hover:text-primary hover:bg-primary-light/60"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setLoginOpen(true);
                    }}
                    className="group btn-outline inline-flex w-full items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                  >
                    <FiUser
                      size={15}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/register/patient");
                    }}
                    className="btn-primary w-full"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate(dashboardPath);
                    }}
                    className="btn-outline w-full"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to logout?")) {
                        logout();
                        setMobileOpen(false);
                        navigate("/");
                      }
                    }}
                    className="btn-primary w-full"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login Modal Only */}
      <LoginRoleModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default Navbar;
